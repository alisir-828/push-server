import assert from 'assert';
import { TsrpcError, WsClient } from 'tsrpc';
import { serviceProto } from '../../src/shared/protocols/serviceProto';

// 1. EXECUTE `npm run dev` TO START A LOCAL DEV SERVER
// 2. EXECUTE `npm test` TO START UNIT TEST

describe('# ApiSend', function () {
    const client = new WsClient(serviceProto, {
        server: 'ws://127.0.0.1:3000',
        json: false,
        logger: console,
    });

    before(async function () {
        const res = await client.connect();
        assert.strictEqual(
            res.isSucc,
            true,
            'Failed to connect to server, have you executed `npm run dev` already?'
        );
    });

    it('## LoginSuccess', async function () {
        const ret = await client.callApi('user/Login', {
            username: 'Test',
            password: '123456',
        });
        assert.ok(ret.isSucc && ret.res.code === 200);
    });

    it('## Check content is empty', async function () {
        const ret = await client.callApi('Send', {
            content: '',
        });
        assert.deepStrictEqual(ret, {
            isSucc: false,
            err: new TsrpcError('Content is empty'),
        });
    });

    after(async function () {
        await client.disconnect();
    });
});
