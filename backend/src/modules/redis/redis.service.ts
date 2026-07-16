import { Injectable, OnModuleDestroy, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private redisClient!: Redis;
  private readonly logger = new Logger(RedisService.name);
  private isConnected = false;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    const redisUrl = this.configService.get<string>('REDIS_URL');
    if (!redisUrl) {
      this.logger.warn('REDIS_URL is not defined in environment variables. Redis service will be disabled.');
      return;
    }

    this.redisClient = new Redis(redisUrl, {
      maxRetriesPerRequest: 3,
      retryStrategy: (times) => {
        if (times > 3) {
          this.logger.error('Redis connection failed after 3 retries. Disabling Redis temporarily.');
          return null; // Stop retrying
        }
        return Math.min(times * 50, 2000);
      },
    });

    this.redisClient.on('connect', () => {
      this.logger.log('Connected to Redis successfully');
      this.isConnected = true;
    });

    this.redisClient.on('error', (err) => {
      this.logger.error(`Redis connection error: ${err.message}`);
      this.isConnected = false;
    });
  }

  onModuleDestroy() {
    if (this.redisClient) {
      this.redisClient.quit();
    }
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    if (!this.isConnected || !this.redisClient) return;
    
    try {
      if (ttlSeconds) {
        await this.redisClient.set(key, value, 'EX', ttlSeconds);
      } else {
        await this.redisClient.set(key, value);
      }
    } catch (error: any) {
      this.logger.error(`Failed to set key ${key} in Redis: ${error.message}`);
    }
  }

  async get(key: string): Promise<string | null> {
    if (!this.isConnected || !this.redisClient) return null;

    try {
      return await this.redisClient.get(key);
    } catch (error: any) {
      this.logger.error(`Failed to get key ${key} from Redis: ${error.message}`);
      return null;
    }
  }

  async del(key: string): Promise<void> {
    if (!this.isConnected || !this.redisClient) return;

    try {
      await this.redisClient.del(key);
    } catch (error: any) {
      this.logger.error(`Failed to delete key ${key} from Redis: ${error.message}`);
    }
  }
}
