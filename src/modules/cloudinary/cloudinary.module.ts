import { Module } from '@nestjs/common';
import { CloudinaryProviders } from './cloudinary.provider';
import { CloudinaryService } from './cloudinary.service';

@Module({
  providers: [CloudinaryService, ...CloudinaryProviders],
  exports: [CloudinaryService],
})
export class CloudinaryModule {}
