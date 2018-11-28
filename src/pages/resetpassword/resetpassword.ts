import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';
import { User } from "../../model/user.model";
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../providers/auth/auth-service';

@IonicPage()
@Component({
  selector: 'page-resetpassword',
  templateUrl: 'resetpassword.html'
})
export class ResetpasswordPage {
  public resetForm: any;
  messageEmail = ""
  errorEmail = false;
  user = {} as User;

  constructor(private toastCtrl: ToastController,
    public navCtrl: NavController, formBuilder: FormBuilder,
    public authService: AuthService) {
    this.resetForm = formBuilder.group({
      email: ['', Validators.required],
    });
  }

  validalogin(user: User): void {
    let { email } = this.resetForm.controls;

    if (!this.resetForm.valid) {
      if (!email.valid) {
        this.errorEmail = true;
        this.messageEmail = "Email obrigatório";
      } else {
        this.messageEmail = "";
      }
    }
    else {
      this.messageEmail = "";
      this.resetPassword(user);
    }
  }

  resetPassword(user: User): void {
    let toast = this.toastCtrl.create({ duration: 3000, position: 'bottom' });
    this.authService.resetPassword(user.email)
      .then(() => {
        toast.setMessage('Solicitação foi enviada para o seu e-mail.')
        toast.present();
        this.navCtrl.pop();
      })
      .catch((error: any) => {
        if (error.code == 'auth/invalid-email') {
          toast.setMessage('O e-mail digitado não é valido.');
        } else if (error.code == 'auth/user-not-found') {
          toast.setMessage('O usuário não foi encontrado.');
        }
        toast.present();
      });
  }

  back(): void {
    this.navCtrl.setRoot('LoginPage');
  }

}
