import { Module } from '@nestjs/common';
import { TaxasEServicosController } from './taxas-e-servicos.controller';
import { TaxasEServicosService } from './taxas-e-servicos.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TaxasEServicos, TaxasEServicosSchema } from './entities/taxas-e-servicos.entity';
import { IsTaxasEServicosIdValidatorConstraint } from './decorators/is-taxas-e-servicos-id.decorator';

@Module({
  controllers: [TaxasEServicosController],
  providers: [TaxasEServicosService, IsTaxasEServicosIdValidatorConstraint],
  imports: [MongooseModule.forFeature([{ name: TaxasEServicos.name, schema: TaxasEServicosSchema }])],
  exports: [TaxasEServicosService]
})
export class TaxasEServicosModule { }
