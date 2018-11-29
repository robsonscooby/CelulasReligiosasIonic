export class Grupo {
    key?: string;
    code : string = null;
    grupo : string = null;
    tk : string = null;

    constructor(values: Object = {}){
        Object.keys(this).forEach(key => {
            if (values.hasOwnProperty(key)) {
                this[key] = values[key];
            }
        });
    }
}