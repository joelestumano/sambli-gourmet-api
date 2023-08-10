import { BadRequestException, Injectable } from '@nestjs/common';
import { PaginateQueryProdutoDto } from './dtos/paginate-query-produto.dto';
import { Model, PaginateModel, PaginateOptions, PaginateResult } from 'mongoose';
import { PaginateConfig } from 'src/common/paginate/paginate-config';
import { InjectModel } from '@nestjs/mongoose';
import { Produto, ProdutoDocument, ProdutoProps } from './entities/produto.entity';
import { ProdutoCreateDto } from './dtos/produto-create.dto';

@Injectable()
export class ProdutosService {

    constructor(@InjectModel(Produto.name) private readonly produtoModel: Model<Produto>) { }

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
        return await this.produtoModel.find({ active: true, isDeleted: false }).sort({ [ProdutoProps.descricao]: 1 }).exec();
    }

    async paginate(dto: PaginateQueryProdutoDto): Promise<PaginateResult<any>> {
        let options: PaginateOptions = {
            page: dto.pagina,
            limit: dto.limite,
            customLabels: PaginateConfig.paginateCustomLabels(),
            sort: { createdAt: 'desc' },
        };

        let query = {};
        if (dto.descricao) {
            query = { isDeleted: false, descricao: { $regex: new RegExp(dto.descricao, 'i') } };
        }

        return await (this.produtoModel as PaginateModel<ProdutoDocument>).paginate(
            query,
            options,
        );
    }
}
