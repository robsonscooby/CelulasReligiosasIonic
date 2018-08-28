import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { CelulaService } from '../../providers/celula/celula.service';
import { Celula } from '../../model/celula/celula.model';
import { EnderecoProvider } from '../../providers/endereco/endereco';
//import { UUID } from 'angular2-uuid';

@IonicPage()
@Component({
  selector: 'page-cadastro-celula',
  templateUrl: 'cadastro-celula.html',
})

export class CadastroCelulaPage {

  public cadForm: any;
  messageName = ""
  messageAdress = "";
  errorName = false;
  errorAdress = false;
  celula: Celula = new Celula();
  enderecoCep: any[];
  cep = '';
  isenabled:boolean=false;

  constructor(formBuilder: FormBuilder, private celulaService: CelulaService, private enderecoService: EnderecoProvider) {
    this.cadForm = formBuilder.group({
      nome: ['', Validators.required],
      adress: ['', Validators.required],
      cep: '',
      tel: '', 
      site: '', 
      desc: ''  
    });
  }

  validar(celula: Celula) {
    let { nome, adress } = this.cadForm.controls;
 
    if (!this.cadForm.valid) {
      if (!nome.valid) {
        this.errorName = true;
        this.messageName = "Nome obrigatório";
      } else {
        this.messageName = "";
      }
 
      if (!adress.valid) {
        this.errorAdress = true;
        this.messageAdress ="Endereço obrigatótio"
      } else {
        this.messageAdress = "";
      }
    } else {
      //celula.uid = UUID.UUID();
      this.celulaService.addCelula(celula);
    }
  }

  getEndereco() {
    //this.cep = '53421180'
    this.enderecoService.getEndereco(this.cep)
      .then((result: string) => {
        this.celula.endereco = result;
      })
      .catch((error: string) => {
        console.error('Erro ao tentar consultar cep.');
      });
  }

}