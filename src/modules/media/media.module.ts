import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import { DatabaseModule } from '@app/base/database/database.module';
import { mediaProvider } from './media.provider';

@Module({
  imports: [DatabaseModule],
  controllers: [MediaController],
  providers: [MediaService, ...mediaProvider],
})
export class MediaModule {}
