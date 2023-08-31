import { ApiProperty, OmitType } from '@nestjs/swagger';
import { ProdutoCreateDto } from './produto-create.dto';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class ProdutoUpdateDto extends OmitType(ProdutoCreateDto, [] as const) {

    @ApiProperty({
        description: 'indica se o produto é ativo no sistema',
        example: true,
    })
    @IsNotEmpty({
        message: 'um valor para active deve ser informado',
    })
    @IsBoolean()
    active: boolean;
}
