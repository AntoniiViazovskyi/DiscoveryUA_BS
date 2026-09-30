import { Joi, Segments } from 'celebrate';

export const createFeedbackSchema = {
  [Segments.BODY]: Joi.object({
    locationId: Joi.string().hex().length(24).required(),
    rate: Joi.number().strict().min(1).max(5).required(),
    description: Joi.string().trim().min(1).max(200).required(),
  }).unknown(false),
};
