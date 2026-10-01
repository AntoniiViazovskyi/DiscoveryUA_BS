import { Joi, Segments } from 'celebrate';

export const getFeedbacksSchema = {
  [Segments.QUERY]: Joi.object({
    locationId: Joi.string().hex().length(24).required(),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(50).default(10),
  }).unknown(false),
};

export const createFeedbackSchema = {
  [Segments.BODY]: Joi.object({
    locationId: Joi.string().hex().length(24).required(),
    rate: Joi.number().strict().min(1).max(5).required(),
    description: Joi.string().trim().min(1).max(200).required(),
  }).unknown(false),
};
