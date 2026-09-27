import { celebrate } from 'celebrate';
import { Router } from 'express';

import { getLocationById } from '../controllers/locationController.js';
import { getAllLocations } from '../controllers/locationsController.js';
import { getAllLocationsSchema } from '../validations/locationsValidation.js';

const locationsRoutes = Router();

locationsRoutes.get('/', celebrate(getAllLocationsSchema), getAllLocations);
locationsRoutes.get('/:locationId', getLocationById);

export default locationsRoutes;
