import { AddressInterface, ClientInterface } from "../entities/client.entity";

export class ClientCreateDto implements ClientInterface {
    adresses: AddressInterface[];
    name: string;
    whatsapp: string;
}