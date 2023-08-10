import { Prop } from "@nestjs/mongoose";

export abstract class Default {

    @Prop({ required: true, default: false })
    isDeleted: boolean;

    @Prop({ required: true, default: true })
    active: boolean;

}