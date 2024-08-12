import { ApiCall } from 'tsrpc';
import { ReqLogin, ResLogin } from '../../shared/protocols/user/PtlLogin';
import { Code } from '../../common/const/code';

export default async function (call: ApiCall<ReqLogin, ResLogin>) {
    const { username, password } = call.req;
    // businessError(200);
    if (username === 'Test' && password === '123456') {
        call.succ({
            code: Code.OK,
            data: {
                id: 1,
                username,
            },
        });
        return;
    }
}
