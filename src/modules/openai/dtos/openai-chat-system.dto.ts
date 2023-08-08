import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class DtoOpenaiChatSystem {
    @ApiProperty({
        description: 'system',
        example: '...',
    })
    @IsNotEmpty({
        message: 'o system deve ser informado',
    })
    @IsString()
    system: string;
}