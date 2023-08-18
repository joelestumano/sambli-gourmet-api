import { Controller } from '@nestjs/common';
import { OpenaiService } from './openai.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('openai')
@ApiTags('openai')
export class OpenaiController {
    constructor(private readonly openaiService: OpenaiService) { }
}
