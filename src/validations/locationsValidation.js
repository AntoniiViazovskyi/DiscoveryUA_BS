import { Joi, Segments } from 'celebrate';

const locationIdParams = Joi.object({
  locationId: Joi.string().hex().length(24).required(),
});

export const getAllLocationsSchema = {
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(50).default(10),
    region: Joi.string().trim(),
    type: Joi.string().trim(),
    search: Joi.string().trim().allow(''),
    rate: Joi.number().min(1).max(5),
    sortBy: Joi.string()
      .valid('rate', 'name', 'createdAt', 'popularity')
      .default('rate'),
    sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
  }),
};

const locationFields = {
  name: Joi.string().trim().min(3).max(96),
  description: Joi.string().trim().min(20).max(6000),
  type: Joi.string().trim().min(1).max(64),
  region: Joi.string().trim().min(1).max(64),
  advantages: Joi.array().items(Joi.string().trim().min(1).max(100)).max(20),
  coordinates: Joi.object({
    lat: Joi.number().min(-90).max(90).required(),
    lon: Joi.number().min(-180).max(180).required(),
  }),
};

export const createLocationSchema = {
  [Segments.BODY]: Joi.object({
    ...locationFields,
    name: locationFields.name.required(),
    description: locationFields.description.required(),
    type: locationFields.type.required(),
    region: locationFields.region.required(),
  }).unknown(false),
};

export const getLocationByIdSchema = {
  [Segments.PARAMS]: locationIdParams,
};

export const updateLocationSchema = {
  [Segments.PARAMS]: locationIdParams,
  [Segments.BODY]: Joi.object({ ...locationFields }).unknown(false),
};
