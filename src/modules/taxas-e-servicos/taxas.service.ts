import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { TaxaCreateDto } from './dtos/taxa-create.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Taxa, TaxaDocument, TaxaRefEnum, TaxaTipEnum } from './entities/taxa.entity';
import mongoose, {
    Model,
    PaginateModel,
    PaginateOptions,
    PaginateResult,
} from 'mongoose';
import { PaginateConfig } from 'src/common/paginate/paginate-config';
import { TaxasPaginateQueryDto } from './dtos/taxas-paginate-query.dto';
import { TaxaUpdateDto } from './dtos/taxa-update.dto';

@Injectable()
export class TaxasService {
    private logger = new Logger(TaxasService.name);

    constructor(
        @InjectModel(Taxa.name)
        private readonly taxasModel: Model<TaxaDocument>,
    ) {
        this.inicializar();
    }

    async inicializar(): Promise<void> {
        try {
            const enumObj = Object.values(TaxaRefEnum);
            for (const TaxaRef of enumObj) {
                const taxaExist = await this.findOne('referencia', TaxaRef);
                if (!taxaExist) {
                    const dto: TaxaCreateDto = {
                        referencia: TaxaRefEnum[TaxaRef],
                        descricao: TaxaRef.replace('',''),
                        valor: 0,
                        tipo: TaxaRef === TaxaRefEnum.ENTREGA ? TaxaTipEnum.INTERNA : TaxaTipEnum.EXTERNA
                    };
                    const taxaServico: TaxaDocument = await this.create(dto);
                    this.logger.log('created: \u2193', taxaServico);
                }
            }
            this.logger.log('Inicialização bem-sucedida');
        } catch (error) {
            this.logger.error('Erro na inicialização:', error);
        }
    }

    private async create(dto: TaxaCreateDto): Promise<TaxaDocument> {
        return await new this.taxasModel(dto).save();
    }

    async paginate(dto: TaxasPaginateQueryDto): Promise<PaginateResult<any>> {
        let options: PaginateOptions = {
            page: dto.pagina,
            limit: dto.limite,
            customLabels: PaginateConfig.paginateCustomLabels(),
            sort: { createdAt: 'desc' },
            pagination: dto.ativarPaginacao,
        };

        let query = { isDeleted: false, active: true };

        return await (
            this.taxasModel as PaginateModel<TaxaDocument>
        ).paginate(query, options);
    }

    async update(id: string, dto: TaxaUpdateDto) {
        const found: TaxaDocument = await this.findById(id);
        const update = await this.taxasModel
            .updateOne({ _id: id }, dto, { upsert: true })
            .exec();
        return update;
    }

    async findById(
        id: mongoose.Schema.Types.ObjectId | string,
    ): Promise<TaxaDocument> {
        const found = await this.taxasModel.findById(`${id}`).exec();
        if (!found) {
            const message = `nenhuma taxa encontrada com a propriedade _id ${id}`;
            throw new NotFoundException(message);
        }
        return found;
    }

    private async findOne(prop: string, value: string): Promise<TaxaDocument> {
        return await this.taxasModel.findOne({ [prop]: value }).exec();
    }

    async findByIdsEntrega(
        ids: mongoose.Schema.Types.ObjectId[] | string[],
    ): Promise<TaxaDocument[]> {
        const found = await this.taxasModel
            .find({
                _id: { $in: ids },
                referencia: TaxaRefEnum.ENTREGA,
            })
            .exec();
        if (!found) {
            return [];
        }
        return found;
    }
}
