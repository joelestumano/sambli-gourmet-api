import { Module } from '@nestjs/common';
import { ProdutosController } from './produtos.controller';
import { ProdutosService } from './produtos.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Produto, ProdutoSchema } from './entities/produto.entity';
import { IsItemIdValidatorConstraint } from './decorators/is-item-id.decorator';

@Module({
  controllers: [ProdutosController],
  providers: [ProdutosService, IsItemIdValidatorConstraint],
  imports: [MongooseModule.forFeature([{ name: Produto.name, schema: ProdutoSchema }])],
  exports: [ProdutosService]
})
export class ProdutosModule {}
