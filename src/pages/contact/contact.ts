import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { AuthService } from '../../providers/auth/auth-service';
import { Igreja } from '../../model/igreja.model';

@IonicPage()
@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html',
})
export class ContactPage {

  following = false;
  user = {
    name: 'Igreja de Deus',
    email: 'igreja@igd.com',
    phone: 'Santo Amaro',
    profileImage: 'assets/imgs/logo.png',
    coverImage: 'assets/imgs/background/background-5.jpg',
    location: 'Recife - PE - Brasil',
    description: 'O senhor é o teu pastor e nada te faltará',
  };

  constructor(public auth: AuthService) {
    let data: Igreja = auth.getInformation();
    this.user.name = data.nome;
    this.user.email = data.email;
    this.user.phone = data.telefone;
    this.user.location = data.endereco;
  }

  ionViewDidLoad() { }

}
