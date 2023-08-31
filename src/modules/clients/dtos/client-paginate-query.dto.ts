import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import { PaginateQueryDto } from "src/common/paginate/paginate-query.dto";
import { Transform } from "class-transformer";

export class ClientPaginateQueryDto extends PaginateQueryDto {
    @ApiProperty({
        description: 'nome ou parte do nome do cliente',
        example: 'qualquer nome',
        required: false,
        default: '',
    })
    @IsOptional()
    name: string;

    @ApiProperty({
        description: 'use true para ignorar paginacao',
        example: true,
        required: false,
        default: false,
    })
    @Transform((t: any) => !(t.value === 'true' || t.value === true || t.value === 1 || t.value === '1'))
    ignorarPaginacao: boolean;
}