import { Module } from '@nestjs/common';
import { InventairesController } from './inventaires.controller';
import { InventairesService } from './inventaires.service';
import { PrismaService } from '../common/prisma.service';

@Module({
  controllers: [InventairesController],
  providers: [InventairesService, PrismaService],
  exports: [InventairesService],
})
export class InventairesModule {}
