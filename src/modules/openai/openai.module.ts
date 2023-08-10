import { Module } from '@nestjs/common';
import { OpenaiController } from './openai.controller';
import { OpenaiService } from './openai.service';
import { OpenaiPromptService } from './openai-prompt.service';
import { ProdutosModule } from '../produtos/produtos.module';

@Module({
  controllers: [OpenaiController],
  providers: [OpenaiService, OpenaiPromptService],
  imports: [ProdutosModule],
  exports: [OpenaiService]
})
export class OpenaiModule { }
