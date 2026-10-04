import createHttpError from 'http-errors';

import { Location } from '../models/location.js';
import { uploadImageToCloudinary } from '../services/cloudinary.js';
import { LocationType } from '../models/locationType.js';
import { Region } from '../models/region.js';

const escapeRegExp = (value) => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

export const getAllLocations = async (req, res) => {
  const {
    page = 1,
    limit = 10,
    region,
    type,
    search,
    rate,
    sortBy = 'rate',
    sortOrder = 'desc',
  } = req.query;

  const skip = (page - 1) * limit;
  const locationsQuery = Location.find();

  if (region) {
    locationsQuery.where('region').equals(region);
  }
  if (type) {
    locationsQuery.where('locationType').equals(type);
  }
  if (search) {
    const searchRegex = new RegExp(escapeRegExp(search), 'i');

    const [regions, locationTypes] = await Promise.all([
      Region.find({
        region: searchRegex,
      }).select('slug'),

      LocationType.find({
        type: searchRegex,
      }).select('slug'),
    ]);

    const regionSlugs = regions.map((item) => item.slug);
    const typeSlugs = locationTypes.map((item) => item.slug);

    locationsQuery.or([
      {
        name: {
          $regex: searchRegex,
        },
      },
      {
        region: {
          $in: regionSlugs,
        },
      },
      {
        locationType: {
          $in: typeSlugs,
        },
      },
    ]);
  }

  if (rate !== undefined) {
    locationsQuery.where('rate').gte(Number(rate));
  }
  const sortDirection = sortOrder === 'desc' ? -1 : 1;

  // const sortDirection =
  //   sortBy === 'popularity' || sortOrder === 'desc' ? -1 : 1;

  const sortField = ['popularity', 'feedbackCount'].includes(sortBy)
    ? 'feedbacksCount'
    : sortBy;

  const [totalLocations, locations] = await Promise.all([
    locationsQuery.clone().countDocuments(),
    locationsQuery
      .sort({ [sortField]: sortDirection })
      .skip(skip)
      .limit(limit),
  ]);
  const totalPages = Math.ceil(totalLocations / limit);

  res.status(200).json({
    page,
    limit,
    totalLocations,
    totalPages,
    locations,
  });
};

export const getLocationById = async (req, res) => {
  const { locationId } = req.params;
  const location = await Location.findById(locationId)
    .populate('ownerId', 'name username avatarUrl')
    .lean();

  if (!location) {
    throw createHttpError(404, 'Location not found');
  }

  const [region, locationType] = await Promise.all([
    Region.findOne({ slug: location.region }).select('region').lean(),
    LocationType.findOne({ slug: location.locationType }).select('type').lean(),
  ]);
  res.status(200).json({
    ...location,
    regionName: region?.region ?? location.region,
    locationTypeName: locationType?.type ?? location.locationType,
  });
};

export const createLocation = async (req, res) => {
  if (!req.file) {
    throw createHttpError(400, 'Image is required');
  }

  const { type, ...locationData } = req.body;
  const uploadedImage = await uploadImageToCloudinary(req.file.buffer);
  const location = await Location.create({
    ...locationData,
    image: uploadedImage.secure_url,
    locationType: type,
    ownerId: req.user._id,
    feedbacksId: [],
  });

  res.status(201).json(location);
};

export const updateLocation = async (req, res) => {
  const { locationId } = req.params;

  const location = await Location.findById(locationId);

  if (!location) {
    throw createHttpError(404, 'Location not found');
  }

  if (String(location.ownerId) !== String(req.user._id)) {
    throw createHttpError(403, 'You can edit only your own locations');
  }

  if (!req.file && Object.keys(req.body).length === 0) {
    throw createHttpError(400, 'At least one field is required');
  }

  const { type, ...locationData } = req.body;
  const updateData = { ...locationData };

  if (type !== undefined) {
    updateData.locationType = type;
  }

  if (req.file) {
    const uploadedImage = await uploadImageToCloudinary(req.file.buffer);
    updateData.image = uploadedImage.secure_url;
  }

  const updatedLocation = await Location.findByIdAndUpdate(
    locationId,
    updateData,
    {
      returnDocument: 'after',
      runValidators: true,
      context: 'query',
    },
  );

  res.status(200).json(updatedLocation);
};
