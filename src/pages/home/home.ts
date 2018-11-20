import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController, LoadingController, NavParams, ItemSliding, AlertController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { Celula } from '../../model/celula.model';
import { AngularFireAuth } from 'angularfire2/auth';
import { CelulaService } from '../../providers/celula/celula.service';
import { LoadingService } from '../../providers/loading.service';
import { AngularFireStorage } from 'angularfire2/storage';
import { FirebaseMessagingProvider } from '../../providers/firebase-messaging';
import firebase from 'firebase/app'
import { AngularFireDatabase } from 'angularfire2/database';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  bkList: Observable<Celula[]>
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
    private alertCtrl: AlertController,
    public fireMessege: FirebaseMessagingProvider,
    private db: AngularFireDatabase) {
  
      this.celulaList = params.data;
      this.bkList = this.celulaList;
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
      await this.removeRoom(celula.nome);
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

  async removeRoom(nome): Promise<void> {
    let rooms = [];
    let ref = await firebase.database().ref('chatrooms/');
    ref.on('value', resp => {
      rooms = snapshotToArray(resp);
    });

    rooms.filter(async sala => {
      if(sala.roomname == nome){
        this.db.list('chatrooms/').remove(sala.key);
      }
    });
    
  }

  more(item: ItemSliding, celula: Celula) :void {
    item.close();
    this.navCtrl.push('DetailPage', {'celula' : celula});
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

  filterItems(ev: any) {
    this.celulaList = this.bkList;
    let val = ev.target.value;
    if(val){
      return this.celulaList = this.celulaList.map(cel => cel.filter((c) => 
        c.nome.toLowerCase().includes(val.toLowerCase())
      ));
    }
  }
}

export const snapshotToArray = snapshot => {
  let returnArr = [];

  snapshot.forEach(childSnapshot => {
      let item = childSnapshot.val();
      item.key = childSnapshot.key;
      returnArr.push(item);
  });

  return returnArr;
};