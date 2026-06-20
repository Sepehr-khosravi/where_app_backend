import {
    Injectable,
    Inject,
} from "@nestjs/common";

import { Location }
from "src/domain/location/entities/location.entity";

import type { ILocationRepository }
from "src/domain/location/repositories/location.repository.interface";

@Injectable()
export class UpdateLocationUseCase {
    constructor(
        @Inject("ILocationRepository")
        private readonly locationRepo: ILocationRepository,
    ) {}

    async execute(
        userId: number,
        latitude: number,
        longitude: number,
    ) {
        await this.locationRepo.upsert(
            new Location(
                userId,
                latitude,
                longitude,
                new Date(),
            ),
        );
    }
}