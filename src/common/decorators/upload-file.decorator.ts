import { UseInterceptors, applyDecorators } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express/multer";
import { ApiBody, ApiConsumes } from "@nestjs/swagger";
import { diskStorage } from "multer";

export function UploadTempFile() {
    return applyDecorators(
        UseInterceptors(
            FileInterceptor('file', {
                storage: diskStorage({
                    destination: 'src/temp',
                    filename: (req, file, cb) => {
                        cb(null, file.originalname);
                    },
                }),
            }),
        ),
        ApiConsumes('multipart/form-data'),
        ApiBody({
            schema: {
                type: 'object',
                properties: {
                    file: {
                        type: 'string',
                        format: 'binary',
                    },
                },
            },
        })
    )
}