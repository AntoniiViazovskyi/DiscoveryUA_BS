import { Joi, Segments } from 'celebrate';

export const getAllLocationsSchema = {
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(50).default(10),
    region: Joi.string().trim(),
    type: Joi.string().trim(),
    search: Joi.string().trim().allow(''),
    rate: Joi.number().min(1).max(5),
    sortBy: Joi.string().valid('rate', 'name').default('rate'),
    sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
  }),
};
