import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { AuthService } from '../../providers/auth/auth-service';
import { Igreja } from '../../model/igreja.model';

@IonicPage()
@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html',
})
export class ContactPage {

  igreja: Igreja; 

  constructor(public auth: AuthService, public navCtrl: NavController) {
    this.igreja = auth.getInformation();
    if (this.igreja.thumbnailURL == undefined) {
      this.igreja.thumbnailURL = 'assets/imgs/logo.png';
    }
  }

  ionViewDidLoad() { }

  openInfo(): void {
    this.navCtrl.push('AboutPage');
  }

}
