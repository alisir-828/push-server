export const kcpConfig = {
    port: 23333,
    conv: 231206,
    nodelay: 1,
    interval: 10,
    resend: 2,
    nc: 1,
    mtu: 1400,
    sndWnd: 1024,
    rcvWnd: 1024,
    checkTime: 10,
    heartbeatInterval: 3000,
    timeoutInterval: 10000,
};

export const clientConfig = {
    maxRetries: 10,
    pingInterval: 3000,
    pongTimeout: 1000,
    isBreakLine: 0,
    reconnectInterval: 3000,
    maxRecInterval: 30000,
    reconnectGap: 2,
};
