import { BaseRequest, BaseResponse, BaseConf } from '../base';

export interface ReqLogin extends BaseRequest {
    username: string;
    password: string;
}

export interface ResLogin extends BaseResponse {
    code: number;
    data: {
        id: number;
        username: string;
    };
}

export const conf: BaseConf = {
    auto_key: 'abc123',
};
