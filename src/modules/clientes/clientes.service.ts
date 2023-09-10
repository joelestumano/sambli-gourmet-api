import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClienteCreateDto } from './dtos/cliente-create.dto';
import mongoose, { Model, PaginateModel, PaginateOptions, PaginateResult } from 'mongoose';
import { Cliente, ClienteDocument } from './entities/cliente.entity';
import { PaginateConfig } from 'src/common/paginate/paginate-config';
import { ClientPaginateQueryDto } from './dtos/cliente-paginate-query.dto';
import { ClienteUpdateDto } from './dtos/cliente-update.dto';

@Injectable()
export class ClientesService {
    constructor(@InjectModel(Cliente.name) private readonly clienteModel: Model<Cliente>) { }

    private logger = new Logger(ClientesService.name);

    async create(clienteCreateDto: ClienteCreateDto): Promise<Cliente> {
        return await new this.clienteModel(clienteCreateDto).save();
    }

    async paginate(dto: ClientPaginateQueryDto): Promise<PaginateResult<any>> {

        let options: PaginateOptions = {
            page: dto.pagina,
            limit: dto.limite,
            customLabels: PaginateConfig.paginateCustomLabels(),
            sort: { createdAt: 'desc' },
            pagination: dto.ativarPaginacao
        };

        let query = { isDeleted: false, active: true };
        if (dto.nomeWhatsapp) {
            const searchTerm = dto.nomeWhatsapp.replace('+', '');
            Object.assign(query, {
                $or: [
                    { nome: { $regex: searchTerm, $options: "i" } },
                    { whatsapp: { $regex: searchTerm, $options: "i" } }
                ]
            })
        }

        return await (this.clienteModel as PaginateModel<ClienteDocument>).paginate(
            query,
            options,
        );
    }

    async update(id: string, dto: ClienteUpdateDto) {
        const found: Cliente = await this.findById(id);
        const update = await this.clienteModel.updateOne({ _id: id }, dto, { upsert: true }).exec();
        return update;
    }

    async findById(id: mongoose.Schema.Types.ObjectId | string): Promise<Cliente> {
        const found = await this.clienteModel.findById(`${id}`).exec();
        if (!found) {
            const message = `nenhum cliente encontrado com a propriedade _id ${id}`;
            throw new NotFoundException(message);
        }
        return found;
    }
}
