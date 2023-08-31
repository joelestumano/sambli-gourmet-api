import { ApiProperty } from "@nestjs/swagger";
import { AddressInterface, ClientInterface } from "../entities/client.entity";
import { IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

class AddressDto implements AddressInterface {

    @ApiProperty({
        description: 'logradouro',
        example: '',
    })
    @IsNotEmpty({
        message: 'o logradouro de endereço do cliente deve ser informado',
    })
    @IsString()
    logradouro: string;

    @ApiProperty({
        description: 'bairro',
        example: '',
    })
    @IsOptional()
    bairro: string;

    @ApiProperty({
        description: 'numero',
        example: '',
    })
    @IsOptional()
    numero: string;

    @ApiProperty({
        description: 'complemento',
        example: '',
    })
    @IsOptional()
    complemento: string;

    @ApiProperty({
        description: 'default',
        example: true,
    })
    @IsOptional()
    default: boolean;
}

export class ClientCreateDto implements ClientInterface {
    @ApiProperty({
        description: 'endereçõs do cliente',
        type: AddressDto,
        isArray: true,
    })
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => AddressDto)
    adresses: AddressDto[];

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