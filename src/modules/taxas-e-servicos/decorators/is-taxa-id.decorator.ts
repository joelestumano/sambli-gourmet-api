import { Injectable } from "@nestjs/common";
import { ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, registerDecorator } from "class-validator";
import mongoose from "mongoose";
import { TaxasService } from "../taxas.service";
import validator from "validator";

@ValidatorConstraint({ name: 'IsTaxasId', async: true })
@Injectable()
export class IsTaxaIdValidatorConstraint implements ValidatorConstraintInterface {
    constructor(private taxasEServicosService: TaxasService) { }
    async validate(id: mongoose.Schema.Types.ObjectId) {
        if (!validator.isMongoId((id).toString())) {
            return false;
        }
        return !(!await this.taxasEServicosService.findById(id));
    }
}

export function IsTaxasId(validationOptions?: ValidationOptions) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsTaxaIdValidatorConstraint,
        });
    };
}