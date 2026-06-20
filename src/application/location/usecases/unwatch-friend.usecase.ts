import { Injectable } from "@nestjs/common";

@Injectable()
export class UnwatchFriendUseCase {
    async execute() {
        return true;
    }
}