import { Injectable } from "@nestjs/common";

import type { ILocationRepository } from "src/domain/location/repositories/location.repository.interface";
import { Location } from "src/domain/location/entities/location.entity";

import { RedisService } from "src/infrastructure/redis/redis.service";

@Injectable()
export class LocationRepositoryImpl implements ILocationRepository {
    private readonly PREFIX = "location:";

    constructor(
        private readonly redis: RedisService,
    ) {}

    async upsert(location: Location): Promise<void> {
        try {
            await this.redis.set(
                this.PREFIX + location.userId,
                JSON.stringify(location),
            );
        } catch (e: any) {
            throw new Error(
                `Failed to save location: ${e.message}`,
            );
        }
    }

    async findByUserId(
        userId: number,
    ): Promise<Location | null> {
        try {
            const data = await this.redis.get(
                this.PREFIX + userId,
            );

            if (!data) {
                return null;
            }

            const parsed = JSON.parse(data);

            return new Location(
                parsed.userId,
                parsed.latitude,
                parsed.longitude,
                new Date(parsed.updatedAt),
            );
        } catch (e: any) {
            throw new Error(
                `Failed to get location: ${e.message}`,
            );
        }
    }

    async findByUserIds(
        userIds: number[],
    ): Promise<Location[]> {
        try {
            const locations: Location[] = [];

            for (const userId of userIds) {
                const location =
                    await this.findByUserId(userId);

                if (location) {
                    locations.push(location);
                }
            }

            return locations;
        } catch (e: any) {
            throw new Error(
                `Failed to get locations: ${e.message}`,
            );
        }
    };


    async delete(userId: number): Promise<void> {
        try{
            await this.redis.delete(this.PREFIX + userId);
        }
        catch(e : any){
            throw new Error(`Failed to delete locations: ${e.message}`);
        }
    }
}