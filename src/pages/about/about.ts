import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { AuthService } from '../../providers/auth/auth-service';

@IonicPage()
@Component({
  selector: 'page-about',
  templateUrl: 'about.html',
})
export class AboutPage {

  following = false;
  user = {
    name: 'Robson Carlos',
    email: 'rcs.robson.carlos.santos@gmail.com',
    profileImage: 'assets/imgs/avatar/robson.jpg',
    coverImage: 'assets/imgs/background/background-5.jpg',
    occupation: 'Analista de Sistemas',
    location: 'Paulista - PE - Brazil',
    description: 'Um homem sábio disse uma vez: quanto mais você fizer alguma coisa, melhor você se tornará nisso.',
  };

  constructor(public auth: AuthService) { }

  ionViewDidLoad() { }

}
