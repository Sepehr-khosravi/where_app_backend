import { Module } from "@nestjs/common";
import { SocketGateway } from "./socket.gateway";
import { SocketService } from "./socket.service";

import { UpdateLocationUseCase } from "src/application/location/usecases/update-location.usecase";
import { WatchFriendUseCase } from "src/application/location/usecases/watch-friend.usecase";
import { UnwatchFriendUseCase } from "src/application/location/usecases/unwatch-friend.usecase";
import { GetFriendLastLocationUseCase } from "src/application/location/usecases/get-friend-last-location.usecase";
import { RelationRepositoryImpl } from "../../infrastructure/relations/repositories/relation.repository";
import { TokenGeneratorService } from "../../infrastructure/auth/services/token-generator.service";
import { LocationRepositoryImpl } from "src/infrastructure/location/repositories/location.repository";
import { RedisService } from "src/infrastructure/redis/redis.service";
import { RedisModule } from "src/infrastructure/redis/redis.module";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/infrastructure/prisma/prisma.service";
import { PrismaModule } from "src/infrastructure/prisma/prisma.module";

@Module({
    providers: [
        SocketGateway,
        SocketService,
        UpdateLocationUseCase,
        WatchFriendUseCase,
        GetFriendLastLocationUseCase,
        UnwatchFriendUseCase,
        RedisService,
        JwtService,
        PrismaService,
        {
            provide: "IJwtRepository",
            useClass: TokenGeneratorService,
        },
        {
            provide : "IRelationRepository",
            useClass : RelationRepositoryImpl
        },
        {
            provide : "ILocationRepository",
            useClass : LocationRepositoryImpl
        }
    ],
    exports: [SocketService],
    imports : [
        RedisModule,
        JwtModule,
        PrismaModule
    ]
})
export class SocketModule {}