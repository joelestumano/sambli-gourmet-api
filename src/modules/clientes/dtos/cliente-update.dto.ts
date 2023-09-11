import { ApiProperty } from "@nestjs/swagger";
import { ClienteInterface } from "../entities/cliente.entity";
import { IsOptional, IsString, MaxLength, MinLength, ValidateNested } from "class-validator";
import { Transform, Type } from "class-transformer";
import { EnderecoDto } from "src/common/dtos/endereco.dto";
import { IsWhatsappValidator } from "../decorators/is-whatsapp.decorator";

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
        example: '9188445566',
    })
    @IsOptional()
    @IsString()
    @Transform(({ value }) => {
        if (!value.startsWith('+55')) {
            value = '+55'.concat(value);
        }
        return value;
    })
    @IsWhatsappValidator({
        message: 'o contato whatsapp deve conter de 10 a 11 caracteres',
    })
    whatsapp: string;
}