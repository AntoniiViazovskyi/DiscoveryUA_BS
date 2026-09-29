import createHttpError from 'http-errors';
import multer from 'multer';

const storage = multer.memoryStorage();

export const uploadImage = multer({
  storage,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter: (req, file, callback) => {
    if (!file.mimetype.startsWith('image/')) {
      callback(createHttpError(400, 'Only image files are allowed'));
      return;
    }

    callback(null, true);
  },
});
