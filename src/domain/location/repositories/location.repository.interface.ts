import { Location } from "../entities/location.entity";

export interface ILocationRepository {
    upsert(
        location: Location
    ): Promise<void>;

    findByUserId(
        userId: number
    ): Promise<Location | null>;

    delete(
        userId: number
    ): Promise<void>;
}