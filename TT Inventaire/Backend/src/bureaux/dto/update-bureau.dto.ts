import { PartialType } from '@nestjs/mapped-types';
import { CreateBureauDto } from './create-bureau.dto';

export class UpdateBureauDto extends PartialType(CreateBureauDto) {}
