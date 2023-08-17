import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';

export class ParamIdDto {
    @ApiProperty({
        description: 'Referencia _id.',
        example: '6243b7378d06be66ee15caf5',
    })
    @IsMongoId()
    id: string;
}