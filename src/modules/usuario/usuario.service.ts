import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Usuario } from './entities/usuario.entity';
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
        return create;
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
}
