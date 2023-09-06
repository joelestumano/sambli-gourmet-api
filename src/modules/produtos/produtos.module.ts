import { Module } from '@nestjs/common';
import { ProdutosController } from './produtos.controller';
import { ProdutosService } from './produtos.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Produto, ProdutoSchema } from './entities/produto.entity';
import { ProdutosChangedListener } from './listeners/produto-updated.listener';

@Module({
  controllers: [ProdutosController],
  providers: [ProdutosService, ProdutosChangedListener],
  imports: [MongooseModule.forFeature([{ name: Produto.name, schema: ProdutoSchema }])],
  exports: [ProdutosService]
})
export class ProdutosModule {}
