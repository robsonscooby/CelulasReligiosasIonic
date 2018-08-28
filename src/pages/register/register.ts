import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { User } from "../../model/user";
import { AngularFireAuth } from "angularfire2/auth";
import { FormBuilder, Validators } from '@angular/forms';

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
  user = {} as User;

  constructor(private afAuth: AngularFireAuth, private toastCtrl: ToastController,
    public navCtrl: NavController, public navParams: NavParams, formBuilder: FormBuilder) {
      this.loginForm = formBuilder.group({
        email: ['', Validators.required],
        password: ['', Validators.required]
      });
  }

  async register(user: User) {
    let toast = this.toastCtrl.create({ duration: 3000, position: 'bottom' });
    try {
      const result = await this.afAuth.auth.createUserWithEmailAndPassword(user.email, user.password);
      toast.setMessage('Usuário criado com sucesso.');
      console.log(result);
    }
    catch (error) {
      if (error.code  == 'auth/email-already-in-use') {
        toast.setMessage('O e-mail digitado já está em uso.');
      } else if (error.code  == 'auth/invalid-email') {
        toast.setMessage('O e-mail digitado não é valido.');
      } else if (error.code  == 'auth/operation-not-allowed') {
        toast.setMessage('Não está habilitado criar usuários.');
      } else if (error.code  == 'auth/weak-password') {
        toast.setMessage('A senha digitada é muito fraca.');
      }
      toast.present();
    }
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
      this.register(user);
    }
  }
}
