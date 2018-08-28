import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { User } from "../../model/user";
import { AngularFireAuth } from 'angularfire2/auth';
import { FormBuilder, Validators } from '@angular/forms';

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

  constructor(private afAuth: AngularFireAuth, private toastCtrl: ToastController,
    public navCtrl: NavController, public navParams: NavParams, formBuilder: FormBuilder) {
      this.loginForm = formBuilder.group({
        email: ['', Validators.required],
        password: ['', Validators.required]
      });
    }
 
  async login(user: User) {
    this.afAuth.auth.signInWithEmailAndPassword(user.email, user.password).then(() => {
      this.navCtrl.setRoot('TabsPage');
    })
    .catch((error: any) => {
      let toast = this.toastCtrl.create({ duration: 3000, position: 'bottom' });
      if (error.code == 'auth/invalid-email') {
        toast.setMessage('O e-mail digitado não é valido.');
      } else if (error.code == 'auth/user-disabled') {
        toast.setMessage('O usuário está desativado.');
      } else if (error.code == 'auth/user-not-found') {
        toast.setMessage('O usuário não foi encontrado.');
      } else if (error.code == 'auth/wrong-password') {
        toast.setMessage('A senha digitada não é valida.');
      }
      toast.present();
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
        this.messagePassword ="Senha obrigatória"
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


}
