import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class DtoWhatsappProfileStatus {
    @ApiProperty({
        description: 'status',
        example: 'Atendendo pedidos! 👱‍♀️',
    })
    @IsNotEmpty({
        message: 'o profileStatus deve ser informado',
    })
    @IsString()
    profileStatus: string;
}
