import { Module } from '@nestjs/common';
import { TaxasController } from './taxas.controller';
import { TaxasService } from './taxas.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Taxa, TaxaSchema } from './entities/taxa.entity';
import { IsTaxaIdValidatorConstraint } from './decorators/is-taxa-id.decorator';

@Module({
  controllers: [TaxasController],
  providers: [TaxasService, IsTaxaIdValidatorConstraint],
  imports: [MongooseModule.forFeature([{ name: Taxa.name, schema: TaxaSchema }])],
  exports: [TaxasService]
})
export class TaxasModule { }
