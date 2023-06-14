import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { MulterError } from 'multer';
import multer = require('multer');

const VALID_IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'svg'];

const imageFilter = (
  req: Request,
  file: Express.Multer.File,
  callback: (error: Error, acceptFile: boolean) => void,
) => {
  const extension = file.originalname.split('.').pop();
  if (!VALID_IMAGE_EXTENSIONS.includes(extension)) {
    callback(new MulterError('LIMIT_UNEXPECTED_FILE'), false);
  } else {
    callback(null, true);
  }
};

export const createImageOption = (fileFilter): MulterOptions => ({
  storage: multer.diskStorage({
    destination: './uploads',
    filename: (req, file, callback) => {
      const extension = file.originalname.split('.').pop();
      callback(null, `${Date.now()}-${file.originalname}.${extension}`);
    },
  }),
  limits: { fileSize: 5242880 },
  fileFilter,
  dest: './uploads',
});

export const imageOption: MulterOptions = createImageOption(imageFilter);
