import { ApiProperty, PickType } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString } from "class-validator";
import { Type } from "class-transformer";

export class TaxaUpdateDto { 
    @ApiProperty({
        description: 'descricao da taxa',
        example: 'entrega',
    })
    @IsOptional()
    @IsString()
    descricao: string;

    @ApiProperty({
        description: 'valor da taxa ',
    })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    valor: number;
} 