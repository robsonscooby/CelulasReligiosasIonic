import { Chat } from "./chat";

export class ChatRoom {
    key?: string;
    roomname : string = null;
    chats: Array<Chat> = [];

    constructor(values: Object = {}){
        Object.keys(this).forEach(key => {
            if (values.hasOwnProperty(key)) {
                this[key] = values[key];
            }
        });
    }
}