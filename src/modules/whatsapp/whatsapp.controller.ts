import {
    Body,
    Controller,
    Get,
    Post,
    Query,
    UploadedFile,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DtoWhatsappProfileStatus } from './dtos/whatsapp-profile-status.dto';
import { DtoWhatsappProfileName } from './dtos/whatsapp-profile-name.dto';
import { UploadTempFile } from 'src/common/decorators/upload-file.decorator';
import { DtoWhatsappSessionName } from './dtos/whatsapp-session-name.dto';

@Controller('whatsapp')
@ApiTags('whatsapp')
export class WhatsappController {
    constructor(private readonly whatsappService: WhatsappService) { }

    @Get('create-session')
    @ApiOperation({
        summary: 'cria uma sessão de cliente whatsapp',
        description: 'sessão whatsapp',
    })
    @ApiResponse({ status: 200, description: 'sucesso' })
    @UsePipes(new ValidationPipe({ transform: true }))
    async createSession(
        @Query() query: DtoWhatsappSessionName
    ) {
        return await this.whatsappService.createSession(query);
    }

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

    @Post('set-profile-pic')
    @ApiOperation({
        summary: 'atualização da foto de perfil',
        description: 'pic',
    })
    @ApiResponse({ status: 201, description: 'sucesso' })
    @UploadTempFile()
    async setProfilePic(@UploadedFile() file: Express.Multer.File) {
        return await this.whatsappService.setProfilePic(file);
    }
}
