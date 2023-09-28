import { Injectable } from "@nestjs/common";
import { ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, registerDecorator } from "class-validator";
import mongoose from "mongoose";
import { TaxasEServicosService } from "../taxas-e-servicos.service";
import validator from "validator";

@ValidatorConstraint({ name: 'IsTaxasEServicosId', async: true })
@Injectable()
export class IsTaxasEServicosIdValidatorConstraint implements ValidatorConstraintInterface {
    constructor(private taxasEServicosService: TaxasEServicosService) { }
    async validate(id: mongoose.Schema.Types.ObjectId) {
        if (!validator.isMongoId((id).toString())) {
            return false;
        }
        return !(!await this.taxasEServicosService.findById(id));
    }
}

export function IsTaxasEServicosId(validationOptions?: ValidationOptions) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsTaxasEServicosIdValidatorConstraint,
        });
    };
}