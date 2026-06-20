import {
    Injectable
} from "@nestjs/common";
import { IJwtRepository } from "src/domain/auth/repositories/jwt.repository.interface";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class TokenGeneratorService implements IJwtRepository{
    constructor(
        private readonly jwt : JwtService,
        private readonly config : ConfigService
    ){};

    async generate(data: any): Promise<String | null> {
        try{
            return await this.jwt.signAsync(data, {
                secret : this.config.get("JWT_KEY"),
            })
        }catch(e : any){
            throw new Error(`Failed to sign a new token : ${e.message}`);
        }
    }
    async verify(token: string): Promise<any> {
        try{
            return await this.jwt.verifyAsync(token, {
                secret : this.config.get("JWT_KEY")
            });
        }
        catch(e : any){
            throw new Error(`Failed to verify token : ${e.message}`);
        }
    }
};