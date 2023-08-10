import { Module } from '@nestjs/common';
import { OpenaiController } from './openai.controller';
import { OpenaiService } from './openai.service';
import { PromptService } from './prompt/prompt.service';

@Module({
  controllers: [OpenaiController],
  providers: [OpenaiService, PromptService],
  exports: [OpenaiService]
})
export class OpenaiModule { }
