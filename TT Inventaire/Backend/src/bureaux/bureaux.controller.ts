import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { BureauxService } from './bureaux.service';
import { CreateBureauDto, UpdateBureauDto } from './dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('bureaux')
@UseGuards(JwtAuthGuard)
export class BureauxController {
  constructor(private readonly bureauxService: BureauxService) {}

  @Post()
  create(@Body() createBureauDto: CreateBureauDto) {
    return this.bureauxService.create(createBureauDto);
  }

  @Get()
  findAll() {
    return this.bureauxService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.bureauxService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBureauDto: UpdateBureauDto,
  ) {
    return this.bureauxService.update(id, updateBureauDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.bureauxService.remove(id);
  }
}
