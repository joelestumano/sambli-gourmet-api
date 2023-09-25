import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class DtoWhatsappSessionName {
  @ApiProperty({
    description: 'nome de sessão',
    example: 'session1',
  })
  @IsNotEmpty({
    message: 'nome de sessão deve ser informada',
  })
  @IsString()
  sessionName: string;
}
