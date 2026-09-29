import { Router } from 'express';

import { uploadLocationImage } from '../controllers/uploadController.js';
import { uploadImage } from '../middleware/upload.js';
import { authenticate } from '../middleware/authenticate.js';
const uploadRoutes = Router();

uploadRoutes.post(
  '/image',
  authenticate,
  uploadImage.single('image'),
  uploadLocationImage,
);

export default uploadRoutes;
