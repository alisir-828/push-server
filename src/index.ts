import * as path from 'path';
import { WsServer } from 'tsrpc';
import { serviceProto } from './shared/protocols/serviceProto';
import { Global } from './db/global';

export const server = new WsServer(serviceProto, {
    port: 3000,
    json: false,
});

async function init() {
    await server.autoImplementApi(path.resolve(__dirname, 'api'));
    await Global.initRedisDb(server.logger);
}

async function main() {
    await init();
    await server.start();
}
main();
