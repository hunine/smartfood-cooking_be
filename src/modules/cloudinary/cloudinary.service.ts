import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { v2 } from 'cloudinary';
import { unlink } from 'fs';

@Injectable()
export class CloudinaryService {
  async uploadImage(file: Express.Multer.File): Promise<any> {
    try {
      const response = await v2.uploader.upload(file.path, {
        folder: 'smartfood_cooking',
      });
      return {
        originalName: response.original_filename,
        url: response.secure_url,
        width: response.width,
        height: response.height,
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    } finally {
      // Delete file after upload
      unlink(file.path, (err) => {
        if (err) {
          throw new InternalServerErrorException(err.message);
        }
      });
    }
  }
}
