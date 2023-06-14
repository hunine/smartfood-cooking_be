import { Injectable } from '@nestjs/common';
import { CloudinaryService } from '@app/cloudinary/cloudinary.service';

@Injectable()
export class MediaService {
  constructor(private cloudinaryService: CloudinaryService) {}

  async uploadFile(file: any): Promise<any> {
    return this.cloudinaryService.uploadImage(file);
  }

  async uploadManyFiles(files: Array<Express.Multer.File>): Promise<any> {
    const tasks = files.map((file) => {
      return this.cloudinaryService.uploadImage(file);
    });
    return Promise.all(tasks);
  }
}
