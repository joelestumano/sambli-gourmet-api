import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PaginateModel, PaginateOptions, PaginateResult } from 'mongoose';
import { PedidosPaginateQueryDto } from './dtos/pedido-paginate-query.dto';
import { PaginateConfig } from 'src/common/paginate/paginate-config';
import { PedidoCreateDto } from './dtos/pedido-create.dto';
import { Pedido, PedidoDocument, PedidoStatusEnum } from './entities/pedido.entity';
import { Cliente } from '../clientes/entities/cliente.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CustomEvent } from '../../common/events/custom.event';
import { PedidoUpdateDto } from './dtos/pedido-update.dto';
import { WhatsappService } from '../whatsapp/whatsapp.service';
import { ClientesService } from '../clientes/clientes.service';
import { PedidoUpdateStatusDto } from './dtos/pedido-update-status.dto';
import { Taxa } from '../taxas-e-servicos/entities/taxa.entity';
import { Produto } from '../produtos/entities/produto.entity';
import { Usuario } from '../usuario/entities/usuario.entity';

@Injectable()
export class PedidosService {

    private readonly logger = new Logger(PedidosService.name);

    constructor(@InjectModel(Pedido.name) private readonly pedidoModel: Model<PedidoDocument>,
        private whatsappService: WhatsappService,
        private clientesService: ClientesService,
        private eventEmitter: EventEmitter2) { }

    async create(dto: PedidoCreateDto): Promise<PedidoDocument> {
        const pedido: PedidoDocument = await new this.pedidoModel(dto).save();
        this.eventEmitter.emit('changed-collection', new CustomEvent('changed-collection-pedidos', `pedido ${pedido['_id']} registrado!`));
        //await this.handleWhatsappMessage(pedido);
        return pedido;
    }

    async paginate(dto: PedidosPaginateQueryDto): Promise<PaginateResult<PedidoDocument>> {
        let options: PaginateOptions = {
            page: dto.pagina,
            limit: dto.limite,
            customLabels: PaginateConfig.paginateCustomLabels(),
            sort: { horaDespacho: 'asc' },
            pagination: dto.ativarPaginacao,
            populate: [
                {
                    path: 'cliente',
                    select: { nome: 1, _id: 1, whatsapp: 1 },
                    model: Cliente.name
                },
                {
                    path: 'items',
                    populate: {
                        path: '_id',
                        select: { _id: 1, bannerUrl: 1, valor: 1, descricao: 1 },
                        model: Produto.name
                    }
                },
                {
                    path: 'taxas',
                    populate: {
                        path: '_id',
                        select: { _id: 1, referencia: 1, valor: 1, descricao: 1, tipo: 1 },
                        model: Taxa.name
                    }
                },
                {
                    path: 'usuario',
                    select: { nome: 1, _id: 1, whatsapp: 1 },
                    model: Usuario.name
                },
            ]
        };

        let query = { isDeleted: false, active: true };
        if (dto.dateStart && dto.dateEnd) {
            const start = new Date(dto.dateStart);
            const end = new Date(dto.dateEnd);

            Object.assign(query, {
                createdAt: {
                    $gte: start,
                    $lt: end
                }
            })
        }

        if (dto.status === PedidoStatusEnum.pendente ||
            dto.status === PedidoStatusEnum.empreparo ||
            dto.status === PedidoStatusEnum.despachado ||
            dto.status === PedidoStatusEnum.concluido ||
            dto.status === PedidoStatusEnum.cancelado) {
            Object.assign(query, {
                status: dto.status
            })
        }

        return await (this.pedidoModel as PaginateModel<PedidoDocument>).paginate(
            query,
            options,
        );
    }

    async update(id: string, dto: PedidoUpdateDto) {
        const found: Pedido = await this.findById(id);

        const updateIsValid = this.updateIsValid(found, dto);

        if (!updateIsValid.valid) {
            throw new BadRequestException(updateIsValid.error);
        }

        const update = await this.pedidoModel.updateOne({ _id: id }, dto, { upsert: true }).exec();
        this.eventEmitter.emit('changed-collection', new CustomEvent('changed-collection-pedidos', `pedido ${found['_id']} atualizado!`));
        return update;
    }

    async updateStatus(id: string, dto: PedidoUpdateStatusDto) {
        const found: Pedido = await this.findById(id);
        const update = await this.pedidoModel.updateOne({ _id: id }, dto, { upsert: true }).exec();
        this.eventEmitter.emit('changed-collection', new CustomEvent('changed-collection-pedidos', `pedido ${found['_id']} atualizado!`));
        return update;
    }

    async findById(id: string): Promise<Pedido> {
        const found = await this.pedidoModel.findById(`${id}`).exec();
        if (!found) {
            const message = `nenhum pedido encontrado com a propriedade _id ${id}`;
            this.logger.error(message);
            throw new NotFoundException(message);
        }
        return found;
    }


    private updateIsValid(pedido: Pedido, dto: PedidoUpdateDto): { valid: boolean, error: string } {
        let despacho = new Date(pedido.horaDespacho);
        despacho.setMinutes(despacho.getMinutes() - 10);
        let moment = new Date();
        moment.setHours(moment.getHours() - 3);//necessário para validação com horário do servidor
        let validTime = (moment < despacho) && pedido.status === PedidoStatusEnum.pendente || pedido.status === PedidoStatusEnum.despachado;
        let validPayment: boolean = false;

        if ('pagamento' in dto) {
            const pedidoPagamento = Object.values(pedido.pagamento).reduce((suma: number, valor: number) => suma + valor, 0);
            const dtoPagamento = Object.values(dto.pagamento).reduce((suma: number, valor: number) => suma + valor, 0);
            validPayment = (dtoPagamento > pedidoPagamento) || (dtoPagamento === pedidoPagamento && pedido.status === PedidoStatusEnum.despachado);
        } else {
            validPayment = true;
        }

        let valid = false;
        let errorMessage = '';

        if ('pagamento' in dto) {
            if (validPayment || ((!validPayment) && validTime)) {
                valid = true;
            } else {
                errorMessage = 'o pedido não pode ser atualizado com valor inferior ao atual';
            }
        } else {
            if (validTime) {
                valid = true;
            } else {
                errorMessage = 'o pedido não pode mais ser atualizado';
            }
        }
        return { valid: valid, error: errorMessage };
    }
}
