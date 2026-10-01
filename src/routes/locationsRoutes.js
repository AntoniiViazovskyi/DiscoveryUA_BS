import { celebrate } from 'celebrate';
import { Router } from 'express';

import {
  createLocation,
  getAllLocations,
  getLocationById,
  updateLocation,
} from '../controllers/locationController.js';
import { authenticate } from '../middleware/authenticate.js';
import { uploadImage } from '../middleware/upload.js';
import {
  createLocationSchema,
  getAllLocationsSchema,
  getLocationByIdSchema,
  updateLocationSchema,
} from '../validations/locationsValidation.js';

const locationsRoutes = Router();

locationsRoutes.get('/', celebrate(getAllLocationsSchema), getAllLocations);
locationsRoutes.get(
  '/:locationId',
  celebrate(getLocationByIdSchema),
  getLocationById,
);

locationsRoutes.post(
  '/',
  authenticate,
  uploadImage.single('images'),
  celebrate(createLocationSchema, { abortEarly: false }),
  createLocation,
);

locationsRoutes.patch(
  '/:locationId',
  authenticate,
  uploadImage.single('images'),
  celebrate(updateLocationSchema, { abortEarly: false }),
  updateLocation,
);

export default locationsRoutes;
