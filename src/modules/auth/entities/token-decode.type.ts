import { Schema } from "mongoose";

export type TokenDecodeType = {
  sub: Schema.Types.ObjectId;
  nome: string;
  email: string;
  iat: number;
  exp: number;
};
