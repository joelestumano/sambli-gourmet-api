import { OmitType } from "@nestjs/swagger";
import { EnderecoDto } from "src/common/dtos/endereco.dto";

export class EnderecoPedidoDto extends OmitType(EnderecoDto, ['principal'] as const) { }