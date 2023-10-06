import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Scope } from '@nestjs/common';
import { Usuario } from 'src/modules/usuario/entities/usuario.entity';

@Injectable({ scope: Scope.DEFAULT })
export class EmailService {
    constructor(private mailerService: MailerService) { }

    async sendMail(usuario: Usuario): Promise<any> {
        return new Promise(async (resolve, reject) => {
            await this.mailerService
                .sendMail({
                    from: 'Equipe SG <joel.estumano@sambli.com.br>',
                    to: usuario.email,
                    subject: 'Senha esquecida',
                    html: `<h1>Olá, ${usuario.nome}</h1>
                          <p>Infelizmente neste moemnto não podemos ajudar você na recuperação de senha, mas fique tranquilo, estamos trabalhando para poder ajudar você o mais breve possível. Avisaremos assim que pudermos.</p>
                          `,
                })
                .then((resp) => {
                    resolve(resp);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }
}
