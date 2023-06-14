import { CLOUDINARY } from '@config/env';
import { v2 } from 'cloudinary';

export enum CloudinaryProvider {
  REPOSITORY = 'CLOUDINARY',
}

export const CloudinaryProviders = [
  {
    provide: CloudinaryProvider.REPOSITORY,
    useFactory: () => {
      return v2.config({
        cloud_name: CLOUDINARY.CLOUD_NAME,
        api_key: CLOUDINARY.API_KEY,
        api_secret: CLOUDINARY.API_SECRET,
      });
    },
  },
];
