import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS_CLIENT } from './redis.provider';

@Injectable()
export class RedisService {
  constructor(@Inject(REDIS_CLIENT) private readonly client: Redis) {}

  /**
   * 
   */
  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    if (ttlSeconds) {
      await this.client.set(key, value, 'EX', ttlSeconds);
    } else {
      await this.client.set(key, value);
    }
  }

  /**
   * 
   */
  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  /**
   * 
   */
  async delete(key: string): Promise<void> {
    await this.client.del(key);
  }

  /**
   * 
   */
  async has(key: string): Promise<boolean> {
    const result = await this.client.exists(key);
    return result === 1;
  }

  /**
   * 
   */
  async ttl(key: string): Promise<number> {
    return this.client.ttl(key);
  }
}