export class Celula {
    key?: string;
    descricao : string = null;
    endereco : string = null;
    nome : string = null;
    site : string = null;
    telefone : string = null;
    uid : string = null;

    constructor(values: Object = {}){
        Object.keys(this).forEach(key => {
            if (values.hasOwnProperty(key)) {
                this[key] = values[key];
            }
        });
    }
}