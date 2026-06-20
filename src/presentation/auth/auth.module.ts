import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";

//providers
import { RegisterUseCase } from "src/application/auth/usecases/register.usecase";
import { LoginUseCase } from "src/application/auth/usecases/login.usecase";
import { VerifyUseCase } from "src/application/auth/usecases/verify.usecase";
import { ResendVerificationCodeUseCase } from "src/application/auth/usecases/resend.usecase";
import { JwtModule } from "@nestjs/jwt";
import { UserRepositoryImpl } from "src/infrastructure/users/repository/user.repository";
import { CryptoCodeGenerator } from "src/infrastructure/auth/services/crypto-code-generator.service";
import { RedisVerificationCodeRepository } from "src/infrastructure/auth/repositories/redis-verification-code.repository";
import { NodemailerEmailSenderService } from "src/infrastructure/email/services/nodemailer-email-sender.service";
import { ConfigService } from "@nestjs/config";
import { TokenGeneratorService } from "src/infrastructure/auth/services/token-generator.service";
import { PrismaModule } from "src/infrastructure/prisma/prisma.module";
import { PrismaService } from "src/infrastructure/prisma/prisma.service";
import { RedisService } from "src/infrastructure/redis/redis.service";
import { RedisModule } from "src/infrastructure/redis/redis.module";
import { REDIS_CLIENT } from "src/infrastructure/redis/redis.provider";

//guard
import { AuthGuard } from "../guards/auth/auth.guard";

@Module({
    controllers :[
        AuthController
    ],
    providers : [
        RegisterUseCase,
        LoginUseCase,
        VerifyUseCase,
        ResendVerificationCodeUseCase,
        PrismaService,
        RedisService,
        AuthGuard,
        {
            provide : "IUserRepository",
            useClass : UserRepositoryImpl
        },
        {
            provide : "ICodeGenerator",
            useClass : CryptoCodeGenerator
        },
        {
            provide : "IVerificationCodeRepository",
            useClass : RedisVerificationCodeRepository
        },
        {
            provide : "IEmailSenderService",
            useClass : NodemailerEmailSenderService
        },
        {
            provide : "IJwtRepository",
            useClass : TokenGeneratorService
        },
    ],
    imports : [
        JwtModule.register({
            global : true,
            secret : (new ConfigService).get("JWT_KEY") || "1234"
        }),
        PrismaModule,
        RedisModule,
        
    ]
})

export class AuthModule{};