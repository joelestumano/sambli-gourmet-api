import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { WhatsappService } from 'src/modules/whatsapp/whatsapp.service';
import { ForgotPasswordEvent } from '../events/forgot-password.event';

@Injectable()
export class ForgotPasswordListener {
    private logger = new Logger(ForgotPasswordListener.name);

    constructor(private whatsappService: WhatsappService) { }

    @OnEvent('forgot.password')
    async handleForgotPasswordEvent(event: ForgotPasswordEvent) {
        await this.whatsappService
            .sendWhatsappMessage(
                event.whatsapp.concat('@c.us').replace('+', ''),
                `Olá *${event.nome}.* Recebemos uma solicitação para redefinir a sua senha. Verifique sua caixa de email para obter mais detalhes.`,
            )
            .then(() => { })
            .catch((error: any) => {
                this.logger.log(error);
            });
    }
}
