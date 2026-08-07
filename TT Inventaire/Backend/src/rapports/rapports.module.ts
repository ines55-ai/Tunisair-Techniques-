import { Module } from '@nestjs/common';
import { RapportsController } from './rapports.controller';
import { RapportsService } from './rapports.service';
import { PrismaService } from '../common/prisma.service';

@Module({
  controllers: [RapportsController],
  providers: [RapportsService, PrismaService],
})
export class RapportsModule {}
