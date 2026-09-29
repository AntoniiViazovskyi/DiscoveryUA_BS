import createHttpError from 'http-errors';

import { uploadImageToCloudinary } from '../services/cloudinary.js';

export const uploadLocationImage = async (req, res) => {
  if (!req.file) {
    throw createHttpError(400, 'Image is required');
  }

  const result = await uploadImageToCloudinary(req.file.buffer);

  res.status(201).json({
    url: result.secure_url,
    publicId: result.public_id,
  });
};
