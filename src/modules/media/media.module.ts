import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import { DatabaseModule } from '@app/base/database/database.module';
import { mediaProvider } from './media.provider';
import { CloudinaryModule } from '@app/cloudinary/cloudinary.module';

@Module({
  imports: [DatabaseModule, CloudinaryModule],
  controllers: [MediaController],
  providers: [MediaService, ...mediaProvider],
  exports: [MediaService],
})
export class MediaModule {}
