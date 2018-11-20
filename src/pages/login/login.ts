import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { User } from "../../model/user.model";
import { FormBuilder, Validators } from '@angular/forms';
import { IgrejaService } from '../../providers/igreja/igreja.service';
import { Igreja } from '../../model/igreja.model';
import { LoadingService } from '../../providers/loading.service';
import { AuthService } from '../../providers/auth/auth-service';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  public loginForm: any;
  messageEmail = ""
  messagePassword = "";
  errorEmail = false;
  errorPassword = false;
  user = {} as User;
  retUser: Igreja;

  constructor(
    public authService: AuthService,
    private toastCtrl: ToastController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    private igrejaService: IgrejaService,
    public loadingService: LoadingService) {

    this.loginForm = formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.user.email = '';
    this.user.password = '';
  }

  async login(user: User) {
    try {
      await this.loadingService.present('Logando...');
      this.authService.signIn(user).then(async () => {
        await this.buscarIgreja(user.email);
        this.authService.setCode(this.retUser.code);
        this.navCtrl.setRoot('TabsPage');
      })
        .catch((error: any) => {
          let toast = this.toastCtrl.create({ duration: 3000, position: 'bottom' });
          if (error.code == 'auth/invalid-email' || error.code == 'auth/user-disabled'
            || error.code == 'auth/user-not-found' || error.code == 'auth/wrong-password') {
            toast.setMessage('E-mail ou senha inválida.');
          }
          toast.present();
        });
      await this.loadingService.dismiss();
    } catch (error) {
      console.error(error);
      await this.loadingService.dismiss();
    }
  }

  buscarIgreja(email: string): Promise<Igreja> {
    return new Promise(async (resolve) => {
      await this.igrejaService.getUser(email).subscribe(u => u.filter(r => {
        resolve(this.retUser = r)
      })).unsubscribe;
    });
  }

  register() {
    this.messageEmail = "";
    this.messagePassword = "";
    this.navCtrl.push('RegisterPage');
  }

  validalogin(user: User) {
    let { email, password } = this.loginForm.controls;

    if (!this.loginForm.valid) {
      if (!email.valid) {
        this.errorEmail = true;
        this.messageEmail = "Email obrigatório";
      } else {
        this.messageEmail = "";
      }

      if (!password.valid) {
        this.errorPassword = true;
        this.messagePassword = "Senha obrigatória"
      } else {
        this.messagePassword = "";
      }
    }
    else {
      this.messageEmail = "";
      this.messagePassword = "";
      this.login(user);
    }
  }

  resetPassword() {
    this.navCtrl.push('ResetpasswordPage');
  }

}