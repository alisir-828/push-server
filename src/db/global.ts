import { createClient, RedisClientType } from 'redis';
import Const from '../common/const';
import { Logger } from 'tsrpc';

export class Global {
    static db: RedisClientType;

    static async initRedisDb(logger?: Logger) {
        const client = createClient({
            url: `redis://${Const.Redis.Address.LOCAL}`,
        });
        client.on('error', err => logger?.log('Redis Client Error', err));
        await client.connect();
        logger?.log(
            'Redis connected successfully to',
            `redis://${Const.Redis.Address.LOCAL}`
        );
        this.db = client as RedisClientType;
    }
}
