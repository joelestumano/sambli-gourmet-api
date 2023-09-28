import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { TaxasEServicosCreateDto } from './dtos/taxas-e-servicos-create.dto';
import { InjectModel } from '@nestjs/mongoose';
import { TaxasEServicos } from './entities/taxas-e-servicos.entity';
import mongoose, { Model } from 'mongoose';

@Injectable()
export class TaxasEServicosService {

    constructor(@InjectModel(TaxasEServicos.name) private readonly taxasEServicosModel: Model<TaxasEServicos>) { }

    private logger = new Logger(TaxasEServicosService.name);

    async create(dto: TaxasEServicosCreateDto): Promise<TaxasEServicos> {
        return await new this.taxasEServicosModel(dto).save();
    }

    async findById(id: mongoose.Schema.Types.ObjectId | string): Promise<TaxasEServicos> {
        const found = await this.taxasEServicosModel.findById(`${id}`).exec();
        if (!found) {
            const message = `nenhuma taxa ou serviço encontrada com a propriedade _id ${id}`;
            throw new NotFoundException(message);
        }
        return found;
    }
}
