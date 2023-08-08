import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class DtoWhatsappProfileName {
    @ApiProperty({
        description: 'name',
        example: 'Best Delivery',
    })
    @IsNotEmpty({
        message: 'o profileName deve ser informado',
    })
    @IsString()
    profileName: string;
}