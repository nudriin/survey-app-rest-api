import { Module } from '@nestjs/common';
import { SkmService } from './skm.service';
import { SkmController } from './skm.controller';

@Module({
  providers: [SkmService],
  controllers: [SkmController]
})
export class SkmModule {}
