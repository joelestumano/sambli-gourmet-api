import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { TaxasEServicosCreateDto } from './dtos/taxas-e-servicos-create.dto';
import { InjectModel } from '@nestjs/mongoose';
import { TaxasEServicos } from './entities/taxas-e-servicos.entity';
import mongoose, { Model, PaginateModel, PaginateOptions, PaginateResult } from 'mongoose';
import { PaginateConfig } from 'src/common/paginate/paginate-config';
import { TaxasEServicoQueryDto } from './dtos/taxas-e-servicos-paginate-query.dto';

@Injectable()
export class TaxasEServicosService {

    constructor(@InjectModel(TaxasEServicos.name) private readonly taxasEServicosModel: Model<TaxasEServicos>) { }

    private logger = new Logger(TaxasEServicosService.name);

    async create(dto: TaxasEServicosCreateDto): Promise<TaxasEServicos> {
        return await new this.taxasEServicosModel(dto).save();
    }

    async paginate(dto: TaxasEServicoQueryDto): Promise<PaginateResult<any>> {

        let options: PaginateOptions = {
            page: dto.pagina,
            limit: dto.limite,
            customLabels: PaginateConfig.paginateCustomLabels(),
            sort: { createdAt: 'desc' },
            pagination: dto.ativarPaginacao
        };

        let query = { isDeleted: false, active: true };

        return await (this.taxasEServicosModel as PaginateModel<TaxasEServicos>).paginate(
            query,
            options,
        );
    }

    async findById(id: mongoose.Schema.Types.ObjectId | string): Promise<TaxasEServicos> {
        const found = await this.taxasEServicosModel.findById(`${id}`).exec();
        if (!found) {
            const message = `nenhuma taxa ou serviço encontrado com a propriedade _id ${id}`;
            throw new NotFoundException(message);
        }
        return found;
    }
}
