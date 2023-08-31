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

    @ApiProperty({
        description: 'use true para ignorar paginacao',
        example: true,
        required: false,
        default: false,
    })
    @Transform((t: any) => !(t.value === 'true' || t.value === true || t.value === 1 || t.value === '1'))
    ignorarPaginacao: boolean;
}