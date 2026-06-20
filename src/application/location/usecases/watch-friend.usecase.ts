import {
    Injectable,
    Inject,
    ForbiddenException,
} from "@nestjs/common";

import type { IRelationRepository }
from "src/domain/relations/repository/relation.repository.interface";


@Injectable()
export class WatchFriendUseCase {
    constructor(
        @Inject("IRelationRepository")
        private readonly relationRepo: IRelationRepository,
    ) {}

    async execute(
        currentUserId: number,
        friendId: number,
    ) {
        const relations =
            await this.relationRepo.findAllRelations(
                currentUserId,
            );

        const isFriend =
            relations.some(
                (relation) =>
                    relation.friend?.id === friendId,
            );

        if (!isFriend) {
            throw new ForbiddenException(
                "You are not friends with this user",
            );
        }

        return true;
    }
}