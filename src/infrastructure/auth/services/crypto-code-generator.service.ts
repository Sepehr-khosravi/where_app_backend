import { Injectable } from "@nestjs/common";
import { ICodeGenerator } from "src/domain/auth/services/code-generator.interface";
import { randomInt } from "crypto";

@Injectable()
export class CryptoCodeGenerator implements ICodeGenerator{
    private readonly CODE_LENGTH = 6;

    generate(): string {
        const min = 10 ** (this.CODE_LENGTH - 1);
        const max = 10 ** this.CODE_LENGTH - 1;
        return randomInt(min, max + 1).toString(); 
    }
}