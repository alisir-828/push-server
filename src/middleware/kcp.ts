import { KCP } from 'node-kcp-x';
import * as dgram from 'dgram';
import { kcpConfig } from '../config/kcpConfig';
import { Logger, WsServer } from 'tsrpc';
import { ServiceType } from '../shared/protocols/serviceProto';
import { EventEmitter } from 'events';

interface ClientContext {
    address: string;
    port: number;
}

interface Group {
    clientKey: string;
}

interface Client extends KCP {
    lastHeartbeat: number;
}

interface EventActionContent extends Group {
    groupId: string;
}

class KcpServer extends EventEmitter {
    private socketServer: dgram.Socket;
    private clients: { [key: string]: Client } = {};
    private groups: { [groupId: string]: string[] } = {};
    port: number;
    server: WsServer<ServiceType>;
    logger: Logger;
    heartbeatInterval: number;
    timeoutInterval: number;
    constructor(server: WsServer<ServiceType>) {
        super();
        this.server = server;
        this.logger = server?.logger;
        this.port = kcpConfig.port;
        this.heartbeatInterval = kcpConfig.heartbeatInterval;
        this.timeoutInterval = kcpConfig.timeoutInterval;
        this.socketServer = dgram.createSocket('udp4');
        this.socketServer.on('error', this.handleError.bind(this));
        this.socketServer.on('message', this.handleMessage.bind(this));
        this.socketServer.on('listening', this.handleListening.bind(this));
        this.startHeartbeatCheck();
        this.on('onKcpPing', this.handleKcpPing.bind(this));
        this.on('onAddGroup', this.handleAddGroup.bind(this));
    }

    private handleError(err: Error) {
        this.logger?.error(
            'Kcp connected error',
            `port:${this.port},err:${err}`
        );
        this.socketServer.close();
    }

    private handleMessage(msg: Buffer, rinfo: dgram.RemoteInfo) {
        const key = `${rinfo.address}_${rinfo.port}`;
        if (!this.clients[key]) {
            const context: ClientContext = {
                address: rinfo.address,
                port: rinfo.port,
            };
            const { nodelay, interval, resend, nc, conv, mtu, sndWnd, rcvWnd } =
                kcpConfig;
            const kcpObj = new KCP(conv, context) as Client;
            kcpObj.nodelay(nodelay, interval, resend, nc);
            kcpObj.setmtu(mtu);
            kcpObj.wndsize(sndWnd, rcvWnd);
            kcpObj.output(this.output.bind(this));
            kcpObj.lastHeartbeat = Date.now();
            this.clients[key] = kcpObj;
            this.check(kcpObj);
        }

        const kcpObj = this.clients[key];
        kcpObj.input(msg);

        const size = kcpObj.peeksize();
        if (size > 0) {
            const buffer = kcpObj.recv();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { action, data }: { action: string; data: any } = JSON.parse(
                buffer.toString()
            );
            data.clientKey = key;
            this.logger?.log(
                `recv: ${buffer} from ${JSON.stringify(kcpObj.context())}`
            );
            kcpObj.send(Buffer.from(buffer));
            this.emit(action, data);
            kcpObj.flush();
        }
    }

    private handleListening() {
        const address = this.socketServer.address();
        this.logger?.log(`server listening ${address.address}:${address.port}`);
    }

    private output(data: Buffer, size: number, context: ClientContext) {
        this.socketServer.send(data, 0, size, context.port, context.address);
    }

    private check(kcpObj: KCP) {
        if (!kcpObj) {
            return;
        }
        const now = Date.now();
        kcpObj.update(now);
        // 10ms 间隔
        setTimeout(() => this.check(kcpObj), kcpConfig.checkTime);
    }

    private handleKcpPing(data: EventActionContent) {
        if (!data || !data?.clientKey) {
            return;
        }
        const client = this.clients[data.clientKey];
        client.lastHeartbeat = Date.now();
        client.send(Buffer.from('PONG'));
        client.flush();
    }

    private handleAddGroup(data: EventActionContent) {
        if (!data || !data?.groupId || !data?.clientKey) {
            return;
        }
        const { clientKey, groupId } = data;
        if (!this.groups[groupId]) {
            this.groups[groupId] = [];
        }
        const groupMap = new Set(this.groups[groupId]);
        if (groupMap.has(clientKey)) {
            return;
        }
        this.groups[groupId].push(clientKey);
    }

    private startHeartbeatCheck() {
        setInterval(() => {
            const now = Date.now();
            for (const [key, client] of Object.entries(this.clients)) {
                if (now - client.lastHeartbeat > this.timeoutInterval) {
                    delete this.clients[key];
                    this.handleClientDisconnect(key);
                }
            }
        }, this.heartbeatInterval);
    }

    private handleClientDisconnect(clientKey: string) {
        this.logger.log(`Client ${clientKey} disconnected.`);
    }

    public start() {
        this.socketServer.bind(this.port);
    }

    public stop() {
        this.socketServer.close();
    }
}

export default KcpServer;
