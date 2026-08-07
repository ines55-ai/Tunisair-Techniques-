import { PartialType } from '@nestjs/mapped-types';
import { CreateInventaireLigneDto } from './create-inventaire-ligne.dto';

export class UpdateInventaireLigneDto extends PartialType(CreateInventaireLigneDto) {}
