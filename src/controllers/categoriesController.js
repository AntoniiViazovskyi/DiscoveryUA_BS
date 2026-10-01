import { LocationType } from '../models/locationType.js';
import { Region } from '../models/region.js';

export const getAllLocationTypes = async (req, res) => {
  const types = await LocationType.find();
  res.status(200).json(types);
};

export const getAllRegions = async (req, res) => {
  const regions = await Region.find();
  res.status(200).json(regions);
};

