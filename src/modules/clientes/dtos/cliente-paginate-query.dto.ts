import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import { PaginateQueryDto } from "src/common/paginate/paginate-query.dto";

export class ClientPaginateQueryDto extends PaginateQueryDto {
    @ApiProperty({
        description: 'nome ou número do whatsapp, ou parte do nome ou do número do whatsapp do cliente',
        example: '',
        required: false,
        default: '',
    })
    @IsOptional()
    nomeWhatsapp: string;
}