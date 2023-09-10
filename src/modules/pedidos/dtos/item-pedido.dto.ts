import { PickType } from "@nestjs/swagger";
import { ProdutoCreateDto } from "src/modules/produtos/dtos/produto-create.dto";

export class ItemPedidoDto extends PickType(ProdutoCreateDto, ['bannerUrl', 'descricao', 'valor'] as const) { }