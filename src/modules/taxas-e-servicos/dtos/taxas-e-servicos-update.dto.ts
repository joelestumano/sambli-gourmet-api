import { PickType } from "@nestjs/swagger";
import { TaxaServicoCreateDto } from "./taxas-e-servicos-create.dto";

export class TaxaServicoUpdateDto extends PickType(TaxaServicoCreateDto, ['valor'] as const) { } 