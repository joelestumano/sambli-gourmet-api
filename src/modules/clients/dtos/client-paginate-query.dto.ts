import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import { PaginateQueryDto } from "src/common/paginate/paginate-query.dto";

export class ClientPaginateQueryDto extends PaginateQueryDto {
    @ApiProperty({
        description: 'nome ou parte do nome do cliente',
        example: '',
        required: false,
        default: '',
    })
    @IsOptional()
    name: string;
}