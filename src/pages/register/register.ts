import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { AngularFireAuth } from "angularfire2/auth";
import { FormBuilder, Validators } from '@angular/forms';
import { UUID } from 'angular2-uuid';
import { Igreja } from '../../model/igreja.model';
import { EnderecoProvider } from '../../providers/endereco/endereco';
import { IgrejaService } from '../../providers/igreja/igreja.service';
import { LoadingService } from '../../providers/loading.service';

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

  constructor(
    private afAuth: AngularFireAuth, 
    private toastCtrl: ToastController,
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public formBuilder: FormBuilder,
    private enderecoService: EnderecoProvider,
    private igrejaService: IgrejaService,
    public loading: LoadingService,
    private alertCtrl: AlertController) {

      this.loginForm = formBuilder.group({
        nome: ['', Validators.required],
        resp: ['', Validators.required],
        tel: ['', Validators.required],
        cep: ['', Validators.required],
        endereco: ['', Validators.required],
        email: ['', Validators.required],
        senha: ['', Validators.required]
      });
  }

  async registerLogin() {
    let toast = this.toastCtrl.create({ duration: 3000, position: 'bottom' });
    try {
      await this.loading.present('Cadastrando...');
      await this.afAuth.auth.createUserWithEmailAndPassword(this.igreja.email, this.igreja.senha);
      this.igreja.senha = null;
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
      this.registerLogin();
    }else{
      this.presentAlert();
    }
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

  async presentAlert(): Promise<void> {
    const alert = await this.alertCtrl.create({
      title: 'Alerta',
      message: 'Favor Preencher todos os campos.',
      buttons: [
        {
          text: 'Ok'
        }
      ]
    });
    await alert.present();
  }

}
