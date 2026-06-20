import { Module } from "@nestjs/common";
import { REDIS_CLIENT, RedisProvider } from "./redis.provider";
import { RedisService } from "./redis.service";

@Module({
    providers : [
        RedisProvider,
        RedisService
    ],
    exports : [
        REDIS_CLIENT,
        RedisService
    ]
})
export class RedisModule{};