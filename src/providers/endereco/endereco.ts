import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the EnderecoProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class EnderecoProvider {

  constructor(public http: HttpClient) {
    console.log('Hello EnderecoProvider Provider');
  }

  getEndereco(cep: string)  {
    return new Promise((resolve, reject) => {
 
      let url = `https://viacep.com.br/ws/${cep}/json/`;
 
      this.http.get(url)
        .subscribe((result: any) => {
          let ret = `${result['logradouro']}, ${result['bairro']}, ${result['localidade']}, ${result['uf']}`;
          resolve(ret);
        },
        (error) => {
          reject(error);
        });
    });
  }

}
