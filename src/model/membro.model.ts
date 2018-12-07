export class Membro {
    key?: string;
    nome : string = null;
    telefone : string = null;
    cep: string = null;
    endereco : string = null;
    code : string = null;
    email : string = null;  
    senha1 : string = null; 
    senha2 : string = null;    
    lat: string = null;
    lng: string = null;
    thumbnailId: string = null;
    thumbnailURL: string = null;
    tk: string = null;

    constructor(values: Object = {}){
        Object.keys(this).forEach(key => {
            if (values.hasOwnProperty(key)) {
                this[key] = values[key];
            }
        });
    }
}