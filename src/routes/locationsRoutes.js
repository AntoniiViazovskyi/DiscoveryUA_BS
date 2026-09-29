import { celebrate } from 'celebrate';
import { Router } from 'express';

import {
  createLocation,
  getLocationById,
  updateLocation,
} from '../controllers/locationController.js';
import { getAllLocations } from '../controllers/locationsController.js';
import { authenticate } from '../middleware/authenticate.js';
import {
  createLocationSchema,
  getAllLocationsSchema,
  updateLocationSchema,
} from '../validations/locationsValidation.js';

const locationsRoutes = Router();

locationsRoutes.get('/', celebrate(getAllLocationsSchema), getAllLocations);
locationsRoutes.get('/:locationId', getLocationById);

locationsRoutes.post(
  '/',
  authenticate,
  celebrate(createLocationSchema, { abortEarly: false }),
  createLocation,
);

locationsRoutes.patch(
  '/:locationId',
  authenticate,
  celebrate(updateLocationSchema, { abortEarly: false }),
  updateLocation,
);

export default locationsRoutes;
