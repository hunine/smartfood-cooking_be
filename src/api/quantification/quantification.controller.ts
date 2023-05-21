import { Controller } from '@nestjs/common';
import { QuantificationService } from './quantification.service';

@Controller('quantification')
export class QuantificationController {
  constructor(private readonly quantificationService: QuantificationService) {}
}
