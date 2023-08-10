import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { BusinessEnum } from "../enums/business.enum";
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
        example: BusinessEnum.bakery,
        enum: BusinessEnum,
        enumName: 'Business'
    })
    @IsEnum(BusinessEnum)
    @Transform((business) => business.value.toLowerCase())
    business: BusinessEnum;
}