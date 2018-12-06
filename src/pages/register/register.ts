import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { AngularFireAuth } from "angularfire2/auth";
import { FormBuilder, Validators } from '@angular/forms';
import { UUID } from 'angular2-uuid';
import { Igreja } from '../../model/igreja.model';
import { EnderecoProvider } from '../../providers/endereco/endereco';
import { IgrejaService } from '../../providers/igreja/igreja.service';
import { LoadingService } from '../../providers/loading.service';
import { AngularFireStorage } from 'angularfire2/storage';

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  public loginForm: any;
  messageEmail = ""
  messagePassword = "";
  errorEmail = false;
  errorPassword = false;
  igreja = {} as Igreja;
  code: string;

  selectedFile: { data: any, base64: string } = { data: null, base64: null };

  constructor(
    private afAuth: AngularFireAuth, 
    private toastCtrl: ToastController,
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public formBuilder: FormBuilder,
    private enderecoService: EnderecoProvider,
    private igrejaService: IgrejaService,
    public loading: LoadingService,
    private alertCtrl: AlertController,
    private storage: AngularFireStorage) {

      this.loginForm = formBuilder.group({
        nome: ['', Validators.required],
        resp: ['', Validators.required],
        tel: ['', Validators.required],
        cep: ['', Validators.required],
        endereco: ['', Validators.required],
        email: ['', Validators.required],
        senha1: ['', Validators.required],
        senha2: ['', Validators.required]
      });
  }

  async registerLogin() {
    let toast = this.toastCtrl.create({ duration: 3000, position: 'bottom' });
    try {
      await this.loading.present('Cadastrando...');
      await this.afAuth.auth.createUserWithEmailAndPassword(this.igreja.email, this.igreja.senha1);

      if (this.selectedFile) {
        await this.uploadFile();
      }

      this.igreja.senha1 = null;
      this.igreja.senha2 = null 
      
      await this.generateCode();
      this.igreja.code = this.code;
      await this.igrejaService.save(this.igreja);
      await this.loading.dismiss();
      toast.setMessage('Igreja cadastra com sucesso.');
      this.navCtrl.pop();
    }
    catch (error) {
      await this.loading.dismiss();
      if (error.code  == 'auth/email-already-in-use') {
        toast.setMessage('O e-mail digitado já está em uso.');
      } else if (error.code  == 'auth/invalid-email') {
        toast.setMessage('O e-mail digitado não é valido.');
      } else if (error.code  == 'auth/operation-not-allowed') {
        toast.setMessage('Não está habilitado criar cadastro.');
      } else if (error.code  == 'auth/weak-password') {
        toast.setMessage('A senha digitada é muito fraca.');
      }
      toast.present();
    }
  }

  validalogin() {
    if (this.loginForm.valid) {
      if(this.validaPassword()){
        this.registerLogin();
      }else{
        this.igreja.senha2 = null;
        this.presentAlert('Senhas diferentes.');
      }
    }else{
      this.presentAlert('Favor Preencher todos os campos.');
    }
  }

  validaPassword(): boolean {
    return this.igreja.senha1 == this.igreja.senha2;
  }
    
  getEndereco() {
    this.enderecoService.getEndereco(this.igreja.cep)
      .then((result: string) => {
        this.igreja.endereco = result;
      })
      .catch((error: string) => {
        console.error('Erro ao tentar consultar cep.');
      });
  }

  async generateCode(){
      this.code = UUID.UUID();
      let ret = this.code.split("-");
      this.code = ret[1];
      console.log(this.code);
      await this.buscarCode(this.code);
  }

  async buscarCode(code: string): Promise<any> {
    return new Promise(async (resolve) => {
      await this.igrejaService.getAll(code).subscribe(async (res) => {
        if(!res.length){
          resolve();
        }else{
          await this.generateCode();
        }
      });
    });
  }

  async presentAlert(msg: string): Promise<void> {
    const alert = await this.alertCtrl.create({
      title: 'Alerta',
      message: msg,
      buttons: [
        {
          text: 'Ok'
        }
      ]
    });
    await alert.present();
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
      const filePath = `igrejas/${id}`;
      const fileRef = this.storage.ref(filePath);
      await this.storage.upload(filePath, this.selectedFile.data);
      this.igreja.thumbnailURL = await fileRef.getDownloadURL().toPromise();
      this.igreja.thumbnailId = id;
    } catch (error) {
      console.log(error);
    }
  }

}
