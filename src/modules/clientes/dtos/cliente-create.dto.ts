import { ApiProperty } from "@nestjs/swagger";
import { ClienteInterface } from "../entities/cliente.entity";
import { IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { EnderecoDto } from "src/common/dtos/endereco.dto";

export class ClienteCreateDto implements ClienteInterface {
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
    @IsNotEmpty({
        message: 'o nome do cliente deve ser informado',
    })
    @IsString()
    name: string;

    @ApiProperty({
        description: 'contato whatsapp do cliente',
        example: '+55918844556622',
    })
    @IsNotEmpty({
        message: 'o contato whatsapp do cliente deve ser informado',
    })
    @IsString()
    whatsapp: string;
}