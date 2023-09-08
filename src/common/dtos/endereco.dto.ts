import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { EnderecoInterface } from "../entities/endereco.entity";

export class EnderecoDto implements EnderecoInterface {

    @ApiProperty({
        description: 'logradouro',
        example: '',
    })
    @IsNotEmpty({
        message: 'o logradouro deve ser informado',
    })
    @IsString()
    logradouro: string;

    @ApiProperty({
        description: 'bairro',
        example: '',
        required: false
    })
    @IsOptional()
    bairro: string;

    @ApiProperty({
        description: 'numero',
        example: '',
        required: false
    })
    @IsOptional()
    numero: string;

    @ApiProperty({
        description: 'complemento',
        example: '',
        required: false
    })
    @IsOptional()
    complemento: string;

    @ApiProperty({
        description: 'default',
        example: true,
    })
    @IsOptional()
    principal: boolean;
}