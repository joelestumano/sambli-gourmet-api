import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { SecurityTokenI, Usuario } from './entities/usuario.entity';
import { UsuarioCreateDto } from './dtos/usuario-create.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuarioService {
    private readonly logger = new Logger(UsuarioService.name);

    constructor(
        @InjectModel(Usuario.name) private readonly usuarioModel: Model<Usuario>,
    ) { }

    async create(dto: UsuarioCreateDto): Promise<Usuario> {
        const dto_: UsuarioCreateDto = {
            ...dto,
            password: await bcrypt.hashSync(dto.password, 10),
        };
        const create: Usuario = await new this.usuarioModel(dto_).save();
        return Object.assign(create, { password: undefined });
    }

    async findUserByEmail(email: string): Promise<Usuario> {
        const found = await this.usuarioModel.findOne({ email: email }).exec();
        if (!found) {
            throw new NotFoundException(
                `nenhum usuário encontrado com e-mail ${email}`,
            );
        }
        return found;
    }

    async findById(idUsuario: string): Promise<Usuario> {
        const found = await this.usuarioModel.findById(`${idUsuario}`).exec();
        if (!found) {
            const message = `nenhum usuário encontrado com _id ${idUsuario}`;
            throw new NotFoundException(message);
        }
        return found;
    }

    async update(idUsuario: string, dataUpdate: any) {
        const user: any = await this.findById(idUsuario);
        return await this.usuarioModel
            .updateOne({ _id: idUsuario }, dataUpdate, { upsert: true })
            .exec();
    }
}
