import { Component } from '@angular/core';
import { IonicPage, AlertController } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { CelulaService } from '../../providers/celula/celula.service';
import { Celula } from '../../model/celula/celula.model';
import { EnderecoProvider } from '../../providers/endereco/endereco';
import { MapService } from '../../providers/map/map.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { UUID } from 'angular2-uuid';
import { AngularFireStorage } from 'angularfire2/storage';
import { LoadingService } from '../../providers/loading.service';

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

  private selectedFile: { data: any, base64: string } = { data: null, base64: null };
  file: File;
  teste: string = 'assets/imgs/logo.png';

  constructor(formBuilder: FormBuilder, 
    private celulaService: CelulaService, 
    private enderecoService: EnderecoProvider,
    private mapService: MapService,
    private alertCtrl: AlertController,
    private sanitizer: DomSanitizer,
    private storage: AngularFireStorage,
    public loading: LoadingService) {

    this.cadForm = formBuilder.group({
      nome: ['', Validators.required],
      adress: ['', Validators.required],
      cep: '',
      tel: '', 
      site: '', 
      desc: ''  
    });
  }

  async validar(celula: Celula) {
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
      // const { lat, lng } = await this.mapService.loadCoordinates(`${celula.endereco}`);
      // if (!lat || !lng) {
      //   return this.presentAlert();
      // }
      celula.id = UUID.UUID();
      // celula.lat = lat;
      // celula.lng = lng;



      if (this.selectedFile) {
        await this.uploadFile();
      }

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

  presentAlert() {
    let alert = this.alertCtrl.create({
      title: 'Alert',
      subTitle: 'Não foi possível localizar coordenadas para o endereço.',
      buttons: ['OK']
    });
    alert.present();
  }

  getSantizeUrl(): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(this.selectedFile.base64);
  }

  async openFile(event: any): Promise<void> {
    const file = event.target.files[0];

    if (file.type.split('/')[0] !== 'image') {
      console.error('Tipo de arquivo não suportado.');
      return;
    }

    const reader = new FileReader();

    reader.onload = e => {
      const base64 = reader.result as string;
      this.selectedFile.data = file;
      this.selectedFile.base64 = base64;
    };
    reader.readAsDataURL(file);
  }

  async uploadFile(): Promise<void> {
    if (!this.selectedFile.data) {
      return;
    }
    try {
      const id = `${new Date().getTime()}_${this.selectedFile.data.name}`;
      const filePath = `celulas/${id}`;
      const fileRef = this.storage.ref(filePath);
      await this.storage.upload(filePath, this.selectedFile.data);
      this.celula.thumbnailURL = await fileRef.getDownloadURL().toPromise();
      this.celula.thumbnailId = id;
    } catch (error) {
      console.log(error);
    }
  }

  editPost(celula: Celula): void {
    this.celula = celula;
    this.selectedFile.base64 = celula.thumbnailURL;
  }

  async deleteCelula(): Promise<void> {
    if (!this.celula.id) {
      return Promise.reject('Nenhuma Celula selecionada.');
    }

    try {
      await this.loading.present('Deletando...');

      this.celulaService.removeCelula(this.celula);
      await this.deleteFile();

      this.clearFields();
      await this.loading.dismiss();
    } catch (error) {
      console.error(error);
      await this.loading.dismiss();
    }
  }

  async deleteFile(): Promise<void> {
    try {
      const filePath = `posts/${this.celula.thumbnailId}`;
      const fileRef = this.storage.ref(filePath);
      await fileRef.delete().toPromise();
    } catch (error) {
      console.log(error);
    }
  }

  clearFields(): void {
    this.selectedFile = { data: null, base64: null };
    this.celula = new Celula();
  }

}