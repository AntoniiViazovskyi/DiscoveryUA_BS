import { Location } from '../models/location.js';

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
    const escapedSearch = escapeRegExp(search);

    locationsQuery.where({
      name: {
        $regex: escapedSearch,
        $options: 'i',
      },
    });
  }

  if (rate !== undefined) {
    locationsQuery.where('rate').gte(Number(rate));
  }

  const sortDirection = sortOrder === 'asc' ? 1 : -1;

  const [totalLocations, locations] = await Promise.all([
    locationsQuery.clone().countDocuments(),
    locationsQuery
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(limit),
  ]);

  const totalPages = Math.ceil(totalLocations / limit);
  res.status(200).json({ page, limit, totalLocations, totalPages, locations });
};
