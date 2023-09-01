import { Injectable } from "@nestjs/common";
import { ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, registerDecorator } from "class-validator";
import mongoose from "mongoose";
import { ClientsService } from "../clients.service";
import validator from "validator";

@ValidatorConstraint({ name: 'IsClientId', async: true })
@Injectable()
export class IsClientIdValidatorConstraint implements ValidatorConstraintInterface {
    constructor(private clientsService: ClientsService) { }
    async validate(id: mongoose.Schema.Types.ObjectId) {
        if (!validator.isMongoId((id).toString())) {
            return false;
        }
        return !(!await this.clientsService.findById(id));
    }
}

export function IsClientId(validationOptions?: ValidationOptions) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsClientIdValidatorConstraint,
        });
    };
}