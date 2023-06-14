import {
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { MediaService } from './media.service';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { imageOption } from '@config/image.config';

@ApiTags('media')
@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('image', {
      limits: { fileSize: 5242880 },
      fileFilter: imageOption.fileFilter,
      dest: './uploads',
    }),
  )
  @ApiOperation({
    tags: ['Images'],
    summary: 'Upload image',
  })
  async uploadFile(
    @UploadedFile()
    file,
  ) {
    return this.mediaService.uploadFile(file);
  }

  @Post('upload-many')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        images: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @UseInterceptors(FilesInterceptor('images', 20, imageOption))
  @ApiOperation({
    tags: ['Images'],
    summary: 'Upload image',
  })
  async uploadFiles(@UploadedFiles() files: Array<Express.Multer.File>) {
    return this.mediaService.uploadManyFiles(files);
  }
}
