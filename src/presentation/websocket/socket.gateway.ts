import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    ConnectedSocket,
    MessageBody,
    WsException,
} from "@nestjs/websockets";

import { Inject } from "@nestjs/common";

import {
    Server,
    Socket,
} from "socket.io";

import type { IJwtRepository }
from "src/domain/auth/repositories/jwt.repository.interface";

import type { TokenPayload }
from "src/domain/auth/entities/token-payload.entity";

import { UpdateLocationUseCase }
from "src/application/location/usecases/update-location.usecase";

import { WatchFriendUseCase }
from "src/application/location/usecases/watch-friend.usecase";

import { SOCKET_EVENTS } from "./events";

import type {
    LocationUpdatePayload,
    WatchFriendPayload,
} from "./types";

@WebSocketGateway({
    cors: {
        origin: "*",
    },
})
export class SocketGateway {

    @WebSocketServer()
    server: Server;

    constructor(
        @Inject("IJwtRepository")
        private readonly jwtRepo: IJwtRepository,

        private readonly updateLocationUseCase:
            UpdateLocationUseCase,

        private readonly watchFriendUseCase:
            WatchFriendUseCase,
    ) {}

    async handleConnection(
        client: Socket,
    ) {
        try {
            const token =
                client.handshake.auth.token;

            if (!token) {
                throw new WsException(
                    "Unauthorized",
                );
            }

            const payload =
                await this.jwtRepo.verify(
                    token,
                ) as TokenPayload;

            client.data.userId =
                payload.id;

        } catch {
            client.disconnect();
        }
    }

    @SubscribeMessage(
        SOCKET_EVENTS.LOCATION_UPDATE,
    )
    async handleLocationUpdate(
        @ConnectedSocket()
        client: Socket,

        @MessageBody()
        data: LocationUpdatePayload,
    ) {
        const userId =
            client.data.userId;

        await this.updateLocationUseCase.execute(
            userId,
            data.latitude,
            data.longitude,
        );

        this.server
            .to(
                `watch_friend_${userId}`,
            )
            .emit(
                SOCKET_EVENTS.FRIEND_LOCATION,
                {
                    userId,
                    latitude:
                        data.latitude,
                    longitude:
                        data.longitude,
                    updatedAt:
                        new Date(),
                },
            );
    }

    @SubscribeMessage(
        SOCKET_EVENTS.WATCH_FRIEND,
    )
    async handleWatchFriend(
        @ConnectedSocket()
        client: Socket,

        @MessageBody()
        data: WatchFriendPayload,
    ) {
        const userId =
            client.data.userId;

        await this.watchFriendUseCase.execute(
            userId,
            data.friendId,
        );

        client.join(
            `watch_friend_${data.friendId}`,
        );

        return {
            success: true,
        };
    }

    @SubscribeMessage(
        SOCKET_EVENTS.UNWATCH_FRIEND,
    )
    async handleUnwatchFriend(
        @ConnectedSocket()
        client: Socket,

        @MessageBody()
        data: WatchFriendPayload,
    ) {
        client.leave(
            `watch_friend_${data.friendId}`,
        );

        return {
            success: true,
        };
    }

    @SubscribeMessage(
        SOCKET_EVENTS.PING,
    )
    handlePing(
        @ConnectedSocket()
        client: Socket,
    ) {
        client.emit(
            SOCKET_EVENTS.PONG,
            "ok",
        );
    }
}