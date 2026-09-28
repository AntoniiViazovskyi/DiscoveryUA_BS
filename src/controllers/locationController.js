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
