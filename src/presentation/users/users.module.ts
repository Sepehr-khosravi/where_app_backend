import { Module } from "@nestjs/common";
//modules
import { PrismaModule } from "src/infrastructure/prisma/prisma.module";
//controller
import { UserController } from "./users.controller";

//usecases
import { GetAllUsersUseCase } from "src/application/users/usecases/get-all-usecase";
import { SearchUsersUseCase } from "src/application/users/usecases/search.usecase";
import { PrismaService } from "src/infrastructure/prisma/prisma.service";

//providers
import { UserRepositoryImpl } from "src/infrastructure/users/repository/user.repository";
import { TokenGeneratorService } from "src/infrastructure/auth/services/token-generator.service";

//guards
import { AuthGuard } from "../guards/auth/auth.guard";


@Module({
    controllers : [
        UserController
    ],
    providers : [
        AuthGuard,
        GetAllUsersUseCase,
        SearchUsersUseCase,
        PrismaService,
        {
            provide : "IUserRepository",
            useClass : UserRepositoryImpl
        },
        {//for our auth guard this is what we need.
            provide : "IJwtRepository",
            useClass : TokenGeneratorService
        }
    ],
    imports : [
        PrismaModule,
    ]
})
export class UserModule{};