import { TokenPayload } from "../entities/token-payload.entity";

export interface IJwtRepository{
    generate(data : any) : Promise<String | null>;
    verify(token : string) : Promise<TokenPayload | null>;
};