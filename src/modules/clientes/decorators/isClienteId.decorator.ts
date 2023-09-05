import { Injectable } from "@nestjs/common";
import { ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, registerDecorator } from "class-validator";
import mongoose from "mongoose";
import { ClientesService } from "../clientes.service";
import validator from "validator";

@ValidatorConstraint({ name: 'IsClienteId', async: true })
@Injectable()
export class IsClienteIdValidatorConstraint implements ValidatorConstraintInterface {
    constructor(private clientsService: ClientesService) { }
    async validate(id: mongoose.Schema.Types.ObjectId) {
        if (!validator.isMongoId((id).toString())) {
            return false;
        }
        return !(!await this.clientsService.findById(id));
    }
}

export function IsClienteId(validationOptions?: ValidationOptions) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsClienteIdValidatorConstraint,
        });
    };
}