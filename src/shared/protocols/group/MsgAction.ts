type Content = {
    groupId: number;
    roleId: string;
    action: string;
};

export interface MsgAction {
    content: Content;
    time: Date;
}
