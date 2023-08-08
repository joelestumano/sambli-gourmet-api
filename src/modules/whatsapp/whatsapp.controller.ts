import { Body, Controller, Post } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DtoWhatsappProfileStatus } from './dtos/whatsapp-profile-status.dto';
import { DtoWhatsappProfileName } from './dtos/whatsapp-profile-name.dto';

@Controller('whatsapp')
@ApiTags('whatsapp')
export class WhatsappController {

    constructor(private readonly whatsappService: WhatsappService) { }

    @Post('set-profile-status')
    @ApiOperation({
        summary: 'atualização de status',
        description: 'status',
    })
    @ApiResponse({ status: 201, description: 'sucesso' })
    async setProfileStatus(@Body() dto: DtoWhatsappProfileStatus) {
        return await this.whatsappService.setProfileStatus(dto);
    }

    @Post('set-profile-name')
    @ApiOperation({
        summary: 'atualização de nome de perfil',
        description: 'name',
    })
    @ApiResponse({ status: 201, description: 'sucesso' })
    async setProfileName(@Body() dto: DtoWhatsappProfileName) {
        return await this.whatsappService.setProfileName(dto);
    }
}
