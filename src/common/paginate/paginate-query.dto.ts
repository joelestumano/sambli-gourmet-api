import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class PaginateQueryDto {
  @ApiProperty({
    description: 'use true para ativar a paginacao',
    example: false,
    required: false,
    default: false,
  })
  @IsOptional()
  @Transform((t: any) => (t.value === 'true' || t.value === true || t.value === 1 || t.value === '1'))
  ativarPaginacao: boolean;

  @ApiProperty({
    description: 'número da página desejada',
    example: '1',
    required: false,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  pagina: number = 1;

  @ApiProperty({
    description: 'limite desejado de documentos por página',
    example: '10',
    required: false,
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  limite: number = 10;
}
