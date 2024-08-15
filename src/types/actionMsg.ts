type Content = {
    groupId: number;
    roleId: number;
    action: string;
};

export interface ActionMsg {
    content: Content;
    time: Date;
}
