import createHttpError from 'http-errors';
import multer from 'multer';

const storage = multer.memoryStorage();

export const uploadImage = multer({
  storage,

  limits: {
    fileSize: 1024 * 1024,
  },

  fileFilter: (req, file, callback) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png'];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      callback(createHttpError(400, 'Only JPG and PNG files are allowed'));
      return;
    }

    callback(null, true);
  },
});
