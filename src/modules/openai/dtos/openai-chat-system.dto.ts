import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class DtoOpenaiChatSystem {
    @ApiProperty({
        description: 'systemContent',
        example: 'Você é uma atendente de delivery de refeição da empresa Xptgh, você deve atender e receber pedidos dos clientes e atender da melhor forma possível',
    })
    @IsNotEmpty({
        message: 'o systemContent deve ser informado',
    })
    @IsString()
    systemContent: string;
}