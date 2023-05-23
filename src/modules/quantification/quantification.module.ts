import { Module } from '@nestjs/common';
import { DatabaseModule } from '@app/base/database/database.module';
import { quantificationProvider } from './quantification.provider';

@Module({
  imports: [DatabaseModule],
  controllers: [],
  providers: [...quantificationProvider],
})
export class QuantificationModule {}
