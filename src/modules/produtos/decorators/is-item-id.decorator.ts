import { Injectable } from "@nestjs/common";
import { ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, registerDecorator } from "class-validator";
import mongoose from "mongoose";
import { ProdutosService } from "../produtos.service";
import validator from "validator";

@ValidatorConstraint({ name: 'IsItemId', async: true })
@Injectable()
export class IsItemIdValidatorConstraint implements ValidatorConstraintInterface {
    constructor(private produtosService: ProdutosService) { }
    async validate(id: mongoose.Schema.Types.ObjectId) {
        if (!validator.isMongoId((id).toString())) {
            return false;
        }
        return !(!await this.produtosService.findById(id));
    }
}

export function IsItemId(validationOptions?: ValidationOptions) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsItemIdValidatorConstraint,
        });
    };
}