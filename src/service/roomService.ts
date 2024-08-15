import { WsConnection, WsServer } from 'tsrpc';
import { MsgChat } from '../shared/protocols/MsgChat';
import { MsgAction } from '../shared/protocols/group/MsgAction';
import { server } from '..';
import { ServiceType } from '../shared/protocols/serviceProto';

export class Room {
    static maxRoomId: number = 0;
    static rooms: { [roomId: number | string]: Room } = {};
    server: WsServer<ServiceType>;
    roomId: number | string;
    conns: WsConnection<ServiceType>[] = [];

    constructor(roomId?: string | number) {
        this.server = server;
        this.roomId = roomId || ++Room.maxRoomId;
        Room.rooms[this.roomId] = this;
    }

    join(conn: WsConnection) {
        this.conns.push(conn);
    }

    sendRoomMsg(msg: MsgChat) {
        server.broadcastMsg('Chat', msg, this.conns);
    }

    leave(conn: WsConnection<ServiceType>) {
        this.conns = this.conns.filter(c => c !== conn);
        if (this.conns.length === 0) {
            delete Room.rooms[this.roomId];
            return;
        }
        const msg: MsgAction = {
            content: {
                groupId: 1,
                action: 'user_level',
                roleId: '200001.11',
            },
            time: new Date(),
        };
        conn.sendMsg('group/Action', msg);
    }

    static getRoomById(roomId: string | number): Room | undefined {
        return Room.rooms[roomId.toString()];
    }
}
