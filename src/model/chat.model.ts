export class Chat {
    key?: string;
    message : string = null;
    sendDate : string = null;
    type : string = null;
    user : string = null;

    constructor(values: Object = {}){
        Object.keys(this).forEach(key => {
            if (values.hasOwnProperty(key)) {
                this[key] = values[key];
            }
        });
    }
}