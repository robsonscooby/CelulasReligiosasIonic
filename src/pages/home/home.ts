import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { Celula } from '../../model/celula/celula.model';
import { CelulaService } from '../../providers/celula/celula.service';
import { AngularFireAuth } from 'angularfire2/auth';

declare var google;

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  celulaList: Observable<Celula[]>
  geocoder;

  constructor(private afAuth: AngularFireAuth, public navCtrl: NavController, private toast: ToastController,
    private celulaService: CelulaService) {
    this.geocoder = new google.maps.Geocoder();
    
  }

  ionViewWillLoad() {
    this.afAuth.authState.subscribe(data => {
      if (data && data.email && data.uid) {
        this.getFromFirebaseAsync();
        this.toast.create({
          message: `Bem vindo!, ${data.email}`,
          duration: 3000
        }).present();
      }
      else {
        this.toast.create({
          message: `Não foi possível se autenticação.`,
          duration: 3000
        }).present();
      }
    })
  }

  openCadastroCelula() :void {
    this.navCtrl.push('CadastroCelulaPage');
  }

  async getFromFirebaseAsync(){
    this.celulaList = await this.celulaService.getCelulaList()
    .snapshotChanges()
    .map(
    changes => {
      return changes.map(c => ({
        key: c.payload.key, ...c.payload.val()
      }))
    });
  }
}