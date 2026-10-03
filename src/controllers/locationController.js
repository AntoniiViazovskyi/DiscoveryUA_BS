import createHttpError from 'http-errors';

import { Location } from '../models/location.js';
import { uploadImageToCloudinary } from '../services/cloudinary.js';

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
    locationsQuery.where({
      name: {
        $regex: escapeRegExp(search),
        $options: 'i',
      },
    });
  }

  if (rate !== undefined) {
    locationsQuery.where('rate').gte(Number(rate));
  }

  const sortDirection = sortOrder === 'desc' ? -1 : 1;
  const sortField = sortBy === 'popularity' ? 'feedbacksCount' : sortBy;
  const [totalLocations, locations] = await Promise.all([
    locationsQuery.clone().countDocuments(),
    locationsQuery
      .sort({ [sortField]: sortDirection })
      .skip(skip)
      .limit(limit),
  ]);

  res.status(200).json({
    page,
    limit,
    totalLocations,
    totalPages: Math.ceil(totalLocations / limit),
    locations,
  });
};

export const getLocationById = async (req, res) => {
  const { locationId } = req.params;
  const location = await Location.findById(locationId).populate(
    'ownerId',
    'name avatarUrl',
  );

  if (!location) {
    throw createHttpError(404, 'Location not found');
  }
  res.status(200).json(location);
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
