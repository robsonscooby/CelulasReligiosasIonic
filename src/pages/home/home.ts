import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController, LoadingController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { Celula } from '../../model/celula/celula.model';
import { AngularFireAuth } from 'angularfire2/auth';
import { CelulaService } from '../../providers/celula/celula.service';
import { LoadingService } from '../../providers/loading.service';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  celulaList: Observable<Celula[]>
  loading  = this.loadingCtrl.create({
    spinner: 'ios',
    content: 'Carregando todas as celulas de estudos bíblicos.'
  });

  constructor(
    private afAuth: AngularFireAuth, 
    public navCtrl: NavController, 
    private toast: ToastController,
    public loadingCtrl: LoadingController, 
    public params: NavParams,
    private celulaService: CelulaService,
    public loadingService: LoadingService ) {
  
      this.celulaList = params.data;
  }

  ionViewWillLoad() {
    this.loading.present();
    this.afAuth.authState.subscribe(data => {
      if (data && data.email && data.uid) {
        this.toast.create({
          message: `Bem vindo!, ${data.email}`,
          duration: 3000
        }).present();
      } else {
        this.toast.create({
          message: `Não foi possível se autenticação.`,
          duration: 3000
        }).present();
      }
    })
    this.loading.dismiss();
  }

  openCadastroCelula() :void {
    this.navCtrl.push('CadastroCelulaPage');
  }

  editCell(celula: Celula): void {
    this.navCtrl.push('CadastroCelulaPage', {'celula' : celula});
  }

  async delete(celula: Celula) {
    try {
      await this.loadingService.present('Deletando...');
      this.celulaService.remove(celula.id);
      await this.loadingService.dismiss();
    } catch (error) {
      console.error(error);
      await this.loadingService.dismiss();
    } 
  }
}