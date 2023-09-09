import { ApiProperty } from "@nestjs/swagger";
import { ClienteInterface } from "../entities/cliente.entity";
import { IsOptional, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { EnderecoDto } from "src/common/dtos/endereco.dto";

export class ClienteUpdateDto implements ClienteInterface {
    @ApiProperty({
        description: 'endereços do cliente',
        type: EnderecoDto,
        isArray: true,
    })
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => EnderecoDto)
    enderecos: EnderecoDto[];

    @ApiProperty({
        description: 'nome do cliente',
        example: 'José Maria',
    })
    @IsOptional()
    @IsString()
    nome: string;

    @ApiProperty({
        description: 'contato whatsapp do cliente',
        example: '+55918844556622',
    })
    @IsOptional()
    @IsString()
    whatsapp: string;
}