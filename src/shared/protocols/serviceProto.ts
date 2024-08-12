import { ServiceProto } from 'tsrpc-proto';
import { MsgChat } from './MsgChat';
import { ReqSend, ResSend } from './PtlSend';
import { ReqLogin, ResLogin } from './user/PtlLogin';

export interface ServiceType {
    api: {
        Send: {
            req: ReqSend;
            res: ResSend;
        };
        'user/Login': {
            req: ReqLogin;
            res: ResLogin;
        };
    };
    msg: {
        Chat: MsgChat;
    };
}

export const serviceProto: ServiceProto<ServiceType> = {
    version: 2,
    services: [
        {
            id: 0,
            name: 'Chat',
            type: 'msg',
        },
        {
            id: 1,
            name: 'Send',
            type: 'api',
        },
        {
            id: 2,
            name: 'user/Login',
            type: 'api',
            conf: {
                auto_key: 'abc123',
            },
        },
    ],
    types: {
        'MsgChat/MsgChat': {
            type: 'Interface',
            properties: [
                {
                    id: 0,
                    name: 'content',
                    type: {
                        type: 'String',
                    },
                },
                {
                    id: 1,
                    name: 'time',
                    type: {
                        type: 'Date',
                    },
                },
            ],
        },
        'PtlSend/ReqSend': {
            type: 'Interface',
            properties: [
                {
                    id: 0,
                    name: 'content',
                    type: {
                        type: 'String',
                    },
                },
            ],
        },
        'PtlSend/ResSend': {
            type: 'Interface',
            properties: [
                {
                    id: 0,
                    name: 'time',
                    type: {
                        type: 'Date',
                    },
                },
            ],
        },
        'user/PtlLogin/ReqLogin': {
            type: 'Interface',
            extends: [
                {
                    id: 0,
                    type: {
                        type: 'Reference',
                        target: 'base/BaseRequest',
                    },
                },
            ],
            properties: [
                {
                    id: 0,
                    name: 'username',
                    type: {
                        type: 'String',
                    },
                },
                {
                    id: 1,
                    name: 'password',
                    type: {
                        type: 'String',
                    },
                },
            ],
        },
        'base/BaseRequest': {
            type: 'Interface',
        },
        'user/PtlLogin/ResLogin': {
            type: 'Interface',
            extends: [
                {
                    id: 0,
                    type: {
                        type: 'Reference',
                        target: 'base/BaseResponse',
                    },
                },
            ],
            properties: [
                {
                    id: 2,
                    name: 'code',
                    type: {
                        type: 'Number',
                    },
                },
                {
                    id: 3,
                    name: 'data',
                    type: {
                        type: 'Interface',
                        properties: [
                            {
                                id: 0,
                                name: 'id',
                                type: {
                                    type: 'Number',
                                },
                            },
                            {
                                id: 1,
                                name: 'username',
                                type: {
                                    type: 'String',
                                },
                            },
                        ],
                    },
                },
            ],
        },
        'base/BaseResponse': {
            type: 'Interface',
        },
    },
};
