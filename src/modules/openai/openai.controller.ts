import { Controller } from '@nestjs/common';
import { OpenaiService } from './openai.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('v1/openai')
@ApiTags('v1/openai')
export class OpenaiController {
    constructor(private readonly openaiService: OpenaiService) { }
}
