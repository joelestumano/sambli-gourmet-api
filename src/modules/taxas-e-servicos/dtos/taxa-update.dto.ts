import { PickType } from "@nestjs/swagger";
import { TaxaCreateDto } from "./taxa-create.dto";

export class TaxaUpdateDto extends PickType(TaxaCreateDto, ['valor', 'descricao'] as const) { } 