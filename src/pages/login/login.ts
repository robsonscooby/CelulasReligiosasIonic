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
        this.authService.setIgreja(this.retUser);
        this.navCtrl.setRoot('TabsPage');
      })
        .catch((error: any) => {
          if (error.code == 'auth/invalid-email' || error.code == 'auth/user-disabled'
            || error.code == 'auth/user-not-found' || error.code == 'auth/wrong-password') {
              this.msgToast('E-mail ou senha inválida.');
          }
        });
      await this.loadingService.dismiss();
    } catch (error) {
      console.error(error);
      await this.loadingService.dismiss();
    }
  }

  msgToast(mgs: string): void {
    let toast = this.toastCtrl.create({ duration: 3000, position: 'bottom' });
    toast.setMessage(mgs);
    toast.present();
  } 

  buscarIgreja(email: string): Promise<Igreja> {
    return new Promise(async (resolve) => {
      await this.igrejaService.getUser(email).subscribe((res) => {
        if(!res.length){
          this.msgToast('Membro não existe.');
        }else{
          this.retUser = res[0];
        }
        resolve();
      });
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