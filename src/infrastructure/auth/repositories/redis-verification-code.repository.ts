import { Injectable } from "@nestjs/common";
import { RedisService } from "src/infrastructure/redis/redis.service";
import { IVerificationCodeRepository } from "src/domain/auth/repositories/veryfication-code.repository.interface";


@Injectable()
export class RedisVerificationCodeRepository implements IVerificationCodeRepository{
    private readonly prefix = "verify:";

    constructor(private readonly redis : RedisService){};

    async set(email: string, code: string, ttlSecconds: number ): Promise<void> {
        await this.redis.set(this.prefix + email, code, ttlSecconds);
    };

    async get(email: string): Promise<string | null> {
        return await this.redis.get(this.prefix + email);
    };

    async delete(email : string) : Promise<void>{
        await this.redis.delete(this.prefix + email);
    };

    
}