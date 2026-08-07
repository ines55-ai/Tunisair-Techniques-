import { PartialType } from '@nestjs/mapped-types';
import { CreateInventaireDto } from './create-inventaire.dto';

export class UpdateInventaireDto extends PartialType(CreateInventaireDto) {}
