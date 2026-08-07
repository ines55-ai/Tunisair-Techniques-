import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { MaterielsService } from './materiels.service';
import { CreateMaterielDto, UpdateMaterielDto } from './dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('materiels')
@UseGuards(JwtAuthGuard)
export class MaterielsController {
  constructor(private readonly materielsService: MaterielsService) {}

  @Post()
  create(@Body() createMaterielDto: CreateMaterielDto) {
    return this.materielsService.create(createMaterielDto);
  }

  @Get()
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;
    return this.materielsService.findAll(pageNum, limitNum, search);
  }

  @Get('statistics')
  getStatistics() {
    return this.materielsService.getStatistics();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.materielsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMaterielDto: UpdateMaterielDto,
  ) {
    return this.materielsService.update(id, updateMaterielDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.materielsService.remove(id);
  }
}
