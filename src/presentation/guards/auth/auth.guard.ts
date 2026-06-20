import {
    Injectable,
    Inject,
    CanActivate,
    ExecutionContext,
    UnauthorizedException
} from "@nestjs/common";
import type { IJwtRepository } from "src/domain/auth/repositories/jwt.repository.interface";

@Injectable()
export class AuthGuard implements CanActivate{
    constructor(
        @Inject("IJwtRepository") private readonly jwt : IJwtRepository
    ){};

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = request.headers.authorization?.replace("Bearer ", "");
        if(!token){
            throw new UnauthorizedException();
        };

        const payload = await this.jwt.verify(token);

        request.user = payload;
        return true;
    }
}