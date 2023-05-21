import { Module } from '@nestjs/common';
import { QuantificationService } from './quantification.service';
import { QuantificationController } from './quantification.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Quantification } from './entities/quantification.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Quantification])],
  controllers: [QuantificationController],
  providers: [QuantificationService],
})
export class QuantificationModule {}
