import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsOptional } from "class-validator";
import { PaginateQueryDto } from "src/common/paginate/paginate-query.dto";

export class PaginateQueryProdutoDto extends PaginateQueryDto {
    @ApiProperty({
        description: 'palavra ou parte de uma palavra contida na descricao do produto',
        example: '',
        required: false,
        default: '',
    })
    @IsOptional()
    descricao: string;
}