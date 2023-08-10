import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class PaginateQueryDto {
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
