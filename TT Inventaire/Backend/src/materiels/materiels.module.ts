import { Module } from '@nestjs/common';
import { MaterielsController } from './materiels.controller';
import { MaterielsService } from './materiels.service';
import { BarcodeService } from './barcode.service';
import { PrismaService } from '../common/prisma.service';

@Module({
  controllers: [MaterielsController],
  providers: [MaterielsService, BarcodeService, PrismaService],
  exports: [MaterielsService],
})
export class MaterielsModule {}
