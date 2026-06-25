import {
    Module
} from "@nestjs/common";

//controller
import { RelationController } from "./relations.controller";

//providers(useacases)
import { AcceptInviteUseCase } from "src/application/relations/usecases/accept-invite.usecase";
import { CancelInviteUseCase } from "src/application/relations/usecases/cancel-invite.usecase";
import { DeleteRelationUseCase } from "src/application/relations/usecases/delete-relation.usecase";
import { GetAllRelationsUseCase } from "src/application/relations/usecases/get-all-relations.usecase";
import { GetInvitesUseCase } from "src/application/relations/usecases/get-invites.usecase";
import { GetSentInvitesUseCase } from "src/application/relations/usecases/get-sent-invites.usecases";
import { RejectInviteUseCase } from "src/application/relations/usecases/reject-invite.usecase";
import { SendInviteUseCase } from "src/application/relations/usecases/send-invite.usecase";
//providers
import { RelationRepositoryImpl } from "src/infrastructure/relations/repositories/relation.repository";
import { PrismaService } from "src/infrastructure/prisma/prisma.service";//for RelationRepository


//guards
import { AuthGuard } from "../guards/auth/auth.guard";
import { JwtService } from "@nestjs/jwt"; //for authguard
import { TokenGeneratorService } from "src/infrastructure/auth/services/token-generator.service";

//modules
import { PrismaModule } from "src/infrastructure/prisma/prisma.module";
import { JwtModule } from "@nestjs/jwt";

@Module({
    controllers : [
        RelationController
    ],
    providers : [
        AuthGuard,
        JwtService,
        PrismaService,
        AcceptInviteUseCase,
        CancelInviteUseCase,
        DeleteRelationUseCase,
        GetAllRelationsUseCase,
        GetInvitesUseCase,
        RejectInviteUseCase,
        SendInviteUseCase,
        GetSentInvitesUseCase,
        {
            provide : "IRelationRepository",
            useClass : RelationRepositoryImpl
        },
        {
            provide : "IJwtRepository",
            useClass : TokenGeneratorService
        }
    ],
    imports : [
        PrismaModule,
        JwtModule
    ]
})
export class RelationModule{};