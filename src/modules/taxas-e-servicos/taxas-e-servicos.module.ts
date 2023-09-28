import { Module } from '@nestjs/common';
import { TaxasEServicosController } from './taxas-e-servicos.controller';
import { TaxasEServicosService } from './taxas-e-servicos.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TaxasEServicos, TaxasEServicosSchema } from './entities/taxas-e-servicos.entity';

@Module({
  controllers: [TaxasEServicosController],
  providers: [TaxasEServicosService],
  imports: [MongooseModule.forFeature([{ name: TaxasEServicos.name, schema: TaxasEServicosSchema }])]
})
export class TaxasEServicosModule {}
