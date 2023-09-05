import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PaginateQueryProdutoDto } from './dtos/produto-paginate-query.dto';
import { Model, PaginateModel, PaginateOptions, PaginateResult } from 'mongoose';
import { PaginateConfig } from 'src/common/paginate/paginate-config';
import { InjectModel } from '@nestjs/mongoose';
import { Produto, ProdutoDocument } from './entities/produto.entity';
import { ProdutoCreateDto } from './dtos/produto-create.dto';
import { ProdutoUpdateDto } from './dtos/produto-update.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CustomEvent } from '../../common/events/pedido-created.event';

@Injectable()
export class ProdutosService {
    private readonly logger = new Logger(ProdutosService.name);
    constructor(@InjectModel(Produto.name) private readonly produtoModel: Model<Produto>,
        private eventEmitter: EventEmitter2) { }

    async create(dto: ProdutoCreateDto): Promise<Produto> {
        const { descricao } = dto;
        const find = await this.produtoModel.findOne({ descricao }).exec();
        if (find) {
            throw new BadRequestException(`o argumento ${descricao} não pode ser usado`);
        }
        const produto = await new this.produtoModel(dto).save();
        return produto;
    }

    async list(): Promise<Produto[]> {
        return await this.produtoModel.find({ active: true, isDeleted: false }).sort({ descricao: 1 }).exec();
    }

    async paginate(dto: PaginateQueryProdutoDto): Promise<PaginateResult<any>> {
        let options: PaginateOptions = {
            page: dto.pagina,
            limit: dto.limite,
            customLabels: PaginateConfig.paginateCustomLabels(),
            sort: { createdAt: 'desc' },
            pagination: dto.ativarPaginacao
        };

        let query = { isDeleted: false, active: true };
        if (dto.descricao) {
            Object.assign(query, { descricao: { $regex: new RegExp(dto.descricao, 'i') } });
        }

        return await (this.produtoModel as PaginateModel<ProdutoDocument>).paginate(
            query,
            options,
        );
    }

    async update(id: string, dto: ProdutoUpdateDto) {
        const found: Produto = await this.findById(id);
        const update = await this.produtoModel.updateOne({ _id: id }, dto, { upsert: true }).exec();
        this.eventEmitter.emit('produto.updated', new CustomEvent('produto atualizado!', update));
        return update;
    }

    async findById(id: string): Promise<Produto> {
        const found = await this.produtoModel.findById(`${id}`).exec();
        if (!found) {
            const message = `nenhum produto encontrado com a propriedade _id ${id}`;
            this.logger.error(message);
            throw new NotFoundException(message);
        }
        return found;
    }
}
