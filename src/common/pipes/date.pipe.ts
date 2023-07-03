import { PipeTransform, BadRequestException } from '@nestjs/common';

export class DatePipe implements PipeTransform {
  transform(value: string): string {
    if (isNaN(Date.parse(value))) {
      throw new BadRequestException(
        'Validation failed (date string is expected)',
      );
    }

    return value;
  }
}
