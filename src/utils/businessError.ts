import { TsrpcError } from 'tsrpc';

export default function businessError(
    message: string = '业务报错',
    code: number = 500
) {
    throw new TsrpcError(message, {
        code,
    });
}
