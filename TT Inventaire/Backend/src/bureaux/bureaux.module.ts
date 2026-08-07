import { Module } from '@nestjs/common';
import { BureauxController } from './bureaux.controller';
import { BureauxService } from './bureaux.service';
import { PrismaService } from '../common/prisma.service';

@Module({
  controllers: [BureauxController],
  providers: [BureauxService, PrismaService],
  exports: [BureauxService],
})
export class BureauxModule {}
