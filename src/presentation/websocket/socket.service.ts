import { Injectable } from "@nestjs/common";
import { SocketGateway } from "./socket.gateway";

@Injectable()
export class SocketService {
    constructor(
        private readonly gateway: SocketGateway,
    ) {}

    emitToRoom(
        room: string,
        event: string,
        data: any,
    ) {
        this.gateway.server
            .to(room)
            .emit(event, data);
    }
}