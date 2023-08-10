import {
    Body,
    Controller,
    Post,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { OpenaiService } from './openai.service';
import { OpenaiChatSystemDto } from './dtos/openai-chat-system.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('openai')
@ApiTags('openai')
export class OpenaiController {
    constructor(private readonly openaiService: OpenaiService) { }

    @Post('set-chat-system')
    @UsePipes(new ValidationPipe({ transform: true }))
    @ApiOperation({
        summary: 'atualização do chat system',
        description: 'chat system',
    })
    @ApiResponse({ status: 201, description: 'sucesso' })
    async setChatSystem(@Body() dto: OpenaiChatSystemDto) {
        return await this.openaiService.setChatSystem(dto);
    }
}
