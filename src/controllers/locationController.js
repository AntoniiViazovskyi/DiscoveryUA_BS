import createHttpError from 'http-errors';
import { isValidObjectId } from 'mongoose';
import { Location } from '../models/location.js';

export const getLocationById = async (req, res) => {
  const { locationId } = req.params;

  if (!isValidObjectId(locationId)) {
    throw createHttpError(400, 'Invalid location ID');
  }
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
  const location = await Location.create({
    ...req.body,
    ownerId: req.user._id,
    feedbacksId: [],
  });

  res.status(201).json(location);
};

export const updateLocation = async (req, res) => {
  const { locationId } = req.params;

  if (!isValidObjectId(locationId)) {
    throw createHttpError(400, 'Invalid location ID');
  }

  const location = await Location.findById(locationId);

  if (!location) {
    throw createHttpError(404, 'Location not found');
  }

  if (String(location.ownerId) !== String(req.user._id)) {
    throw createHttpError(403, 'You can edit only your own locations');
  }

  const updatedLocation = await Location.findByIdAndUpdate(
    locationId,
    req.body,
    {
      returnDocument: 'after',
      runValidators: true,
      context: 'query',
    },
  );

  res.status(200).json(updatedLocation);
};
