import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController, LoadingController, NavParams, ItemSliding, AlertController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { Celula } from '../../model/celula/celula.model';
import { AngularFireAuth } from 'angularfire2/auth';
import { CelulaService } from '../../providers/celula/celula.service';
import { LoadingService } from '../../providers/loading.service';
import { AngularFireStorage } from 'angularfire2/storage';

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
    public loadingService: LoadingService,
    private storage: AngularFireStorage,
    private alertCtrl: AlertController) {
  
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

  editCell(item: ItemSliding, celula: Celula): void {
    item.close();
    this.navCtrl.push('CadastroCelulaPage', {'celula' : celula});
  }

  async delete(item: ItemSliding, celula: Celula) {
    try {
      await this.loadingService.present('Deletando...');
      item.close();
      this.deleteFile(celula);
      this.celulaService.remove(celula.key);
      await this.loadingService.dismiss();
    } catch (error) {
      console.error(error);
      await this.loadingService.dismiss();
    } 
  }

  async deleteFile(celula: Celula): Promise<void> {
    try {
      const filePath = `celulas/${celula.thumbnailId}`;
      const fileRef = this.storage.ref(filePath);
      await fileRef.delete().toPromise();
    } catch (error) {
      console.log(error);
    }
  }

  more(item: ItemSliding) :void {
    item.close();
  }

  async presentAlertConfirmation(item: ItemSliding, celula: Celula): Promise<void> {
    const alert = await this.alertCtrl.create({
      title: 'Deseja excluir Celula?',
      message: celula.nome,
      buttons: [
        {
          text: 'Não'
        },
        {
          text: 'Sim',
          handler: () => {
            this.delete(item, celula);
          }
        }
      ]
    });
  
    await alert.present();
  }
}