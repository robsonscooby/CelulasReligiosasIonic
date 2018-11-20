import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ItemSliding, AlertController } from 'ionic-angular';
import firebase from 'firebase/app'
import { LoadingService } from '../../providers/loading.service';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { ChatRoom } from '../../model/chatRoom.model';

@IonicPage()
@Component({
  selector: 'page-config-chat',
  templateUrl: 'config-chat.html',
})
export class ConfigChatPage {

  ref = firebase.database().ref('chatrooms/');
  rooms: Observable<ChatRoom[]>;
  roomname: string;
  roomManagement: string = 'read';

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public loadingService: LoadingService,
    private db: AngularFireDatabase,
    private alertCtrl: AlertController) {
      this.rooms = navParams.get('rooms');
  }

  ionViewDidLoad() {}

  addRoom() {
    let newData = this.ref.push();
    newData.set({
      roomname: this.roomname
    });
    this.roomManagement = 'read'
  }

  async delete(item: ItemSliding, room: any) {
    try {
      await this.loadingService.present('Deletando sala...');
      item.close();
      this.db.list('chatrooms/').remove(room.key);
      await this.loadingService.dismiss();
    } catch (error) {
      console.error(error);
      await this.loadingService.dismiss();
    } 
  }

  async presentAlertConfirmation(item: ItemSliding, room: any): Promise<void> {
    const alert = await this.alertCtrl.create({
      title: 'Deseja excluir sala?',
      message: room.roomname,
      buttons: [
        {
          text: 'Não'
        },
        {
          text: 'Sim',
          handler: () => {
            this.delete(item, room);
          }
        }
      ]
    });
    await alert.present();
  }

  async presentAlertConfirmationClear(item: ItemSliding, room: any): Promise<void> {
    const alert = await this.alertCtrl.create({
      title: 'Deseja apagar conversas da sala?',
      message: room.roomname,
      buttons: [
        {
          text: 'Não'
        },
        {
          text: 'Sim',
          handler: () => {
            this.limparConversa(item, room);
          }
        }
      ]
    });
    await alert.present();
  }

  async limparConversa(item, room) {
    try {
      await this.loadingService.present('Apagando conversas...');
      item.close();
      this.db.list(`chatrooms/${room.key}/chats/`).remove();
      await this.loadingService.dismiss();
    } catch (error) {
      console.error(error);
      await this.loadingService.dismiss();
    } 
  }
}