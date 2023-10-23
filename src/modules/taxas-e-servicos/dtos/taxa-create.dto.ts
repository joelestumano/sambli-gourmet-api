import { ApiProperty } from '@nestjs/swagger';
import {
    TaxaRefEnum,
    TaxaInterface,
    TaxaTipEnum,
} from '../entities/taxa.entity';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class TaxaCreateDto implements TaxaInterface {
    @ApiProperty({
        description: 'referencia da taxa',
        example: TaxaRefEnum.ENTREGA,
        enum: TaxaRefEnum,
        enumName: 'TaxaRefEnum',
    })
    @IsEnum(TaxaRefEnum)
    referencia: TaxaRefEnum;

    @ApiProperty({
        description: 'descricao da taxa',
        example: 'entrega',
    })
    @IsNotEmpty({
        message: 'a descricao da taxa deve ser informada',
    })
    @IsString()
    descricao: string;

    @ApiProperty({
        description: 'valor da taxa ',
    })
    @IsNumber()
    @IsNotEmpty({
        message: 'o valor da taxa deve ser informado',
    })
    @Type(() => Number)
    valor: number;

    @ApiProperty({
        description: 'tipo da taxa',
        example: TaxaTipEnum.INTERNA,
        enum: TaxaTipEnum,
        enumName: 'TaxaTipEnum',
    })
    @IsEnum(TaxaTipEnum)
    tipo: TaxaTipEnum;
}
