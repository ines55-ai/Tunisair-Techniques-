import { Module } from '@nestjs/common';
import { MouvementsController } from './mouvements.controller';
import { MouvementsService } from './mouvements.service';
import { MouvementsPdfService } from './mouvements-pdf.service';
import { PrismaService } from '../common/prisma.service';

@Module({
  controllers: [MouvementsController],
  providers: [MouvementsService, MouvementsPdfService, PrismaService],
  exports: [MouvementsService],
})
export class MouvementsModule {}
