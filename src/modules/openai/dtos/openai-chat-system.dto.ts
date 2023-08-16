import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { EBusiness } from "../enums/openai.enum";
import { Transform } from "class-transformer";

export class OpenaiChatSystemDto {
    @ApiProperty({
        description: 'company',
        example: 'Best Delivery',
    })
    @IsNotEmpty({
        message: 'o company deve ser informado',
    })
    @IsString()
    company: string;

    @ApiProperty({
        description: 'business (ramo de atividade)',
        example: EBusiness.bakery,
        enum: EBusiness,
        enumName: 'Business'
    })
    @IsEnum(EBusiness)
    @Transform((business) => business.value.toLowerCase())
    business: EBusiness;
}