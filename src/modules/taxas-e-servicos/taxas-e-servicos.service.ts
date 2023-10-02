import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { TaxaServicoCreateDto } from './dtos/taxas-e-servicos-create.dto';
import { InjectModel } from '@nestjs/mongoose';
import { TaxaServico, TaxaServicoDescricaoEnum } from './entities/taxas-e-servicos.entity';
import mongoose, {
    Model,
    PaginateModel,
    PaginateOptions,
    PaginateResult,
} from 'mongoose';
import { PaginateConfig } from 'src/common/paginate/paginate-config';
import { TaxasEServicoQueryDto } from './dtos/taxas-e-servicos-paginate-query.dto';
import { TaxaServicoUpdateDto } from './dtos/taxas-e-servicos-update.dto';

@Injectable()
export class TaxasEServicosService {
    private logger = new Logger(TaxasEServicosService.name);

    constructor(
        @InjectModel(TaxaServico.name)
        private readonly taxasEServicosModel: Model<TaxaServico>,
    ) {
        this.inicializar();
    }

    async inicializar(): Promise<void> {
        try {
            const taxaEntregaExist = await this.findOne('descricao', TaxaServicoDescricaoEnum.entrega);
            if (!taxaEntregaExist) {
                const dto: TaxaServicoCreateDto = { descricao: TaxaServicoDescricaoEnum.entrega, valor: 0 };
                const taxaServico: TaxaServico = await this.create(dto);
                this.logger.log('created: \u2193', taxaServico);
            }
            this.logger.log('Inicialização bem-sucedida');
        } catch (error) {
            this.logger.error('Erro na inicialização:', error);
        }
    }

    private async create(dto: TaxaServicoCreateDto): Promise<TaxaServico> {
        return await new this.taxasEServicosModel(dto).save();
    }

    async paginate(dto: TaxasEServicoQueryDto): Promise<PaginateResult<any>> {
        let options: PaginateOptions = {
            page: dto.pagina,
            limit: dto.limite,
            customLabels: PaginateConfig.paginateCustomLabels(),
            sort: { createdAt: 'desc' },
            pagination: dto.ativarPaginacao,
        };

        let query = { isDeleted: false, active: true };

        return await (
            this.taxasEServicosModel as PaginateModel<TaxaServico>
        ).paginate(query, options);
    }

    async update(id: string, dto: TaxaServicoUpdateDto) {
        const found: TaxaServico = await this.findById(id);
        const update = await this.taxasEServicosModel
            .updateOne({ _id: id }, dto, { upsert: true })
            .exec();
        return update;
    }

    async findById(
        id: mongoose.Schema.Types.ObjectId | string,
    ): Promise<TaxaServico> {
        const found = await this.taxasEServicosModel.findById(`${id}`).exec();
        if (!found) {
            const message = `nenhuma taxa ou serviço encontrado com a propriedade _id ${id}`;
            throw new NotFoundException(message);
        }
        return found;
    }

    private async findOne(prop: string, value: string): Promise<TaxaServico> {
        return await this.taxasEServicosModel.findOne({ [prop]: value }).exec();
    }

    async findByIdsEntrega(
        ids: mongoose.Schema.Types.ObjectId[] | string[],
    ): Promise<TaxaServico[]> {
        const found = await this.taxasEServicosModel
            .find({
                _id: { $in: ids },
                descricao: TaxaServicoDescricaoEnum.entrega,
            })
            .exec();
        if (!found) {
            return [];
        }
        return found;
    }
}
