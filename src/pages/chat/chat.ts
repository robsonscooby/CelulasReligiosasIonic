import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content } from 'ionic-angular';
import * as firebase from 'Firebase';
import { Observable } from 'rxjs/Observable';
import { ChatRoom } from '../../model/chatRoom.model';
import { AngularFireDatabase } from 'angularfire2/database';

@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {
  @ViewChild(Content) content: Content;

  data = { roomkey:'', roomname:'', type:'', nickname:'', message:'' };
  rooms: Observable<ChatRoom[]>;
  ref = firebase.database().ref('chatrooms/');
  chatManagement = 'name';
  chats = [];
  offStatus:boolean = false;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private db: AngularFireDatabase,) {
   
      this.rooms = this.getAll();

  }

  ionViewDidLoad() {
  }

  getAll() {
    return this.db.list('chatrooms/', ref => ref.orderByChild('roomname'))
      .snapshotChanges()
      .map(changes => {
        return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
      })
  }

  enterNickname() {
    if(this.data.nickname){
      this.chatManagement = 'room';
    }
  }

  addRoom() {
    let newData = this.ref.push();
    newData.set({
      roomname:this.data.roomname
    });
  }

  joinRoom(key) {
    this.data.roomkey = key;
    this.chatManagement = 'chat';
    this.enterChat();
  }

  enterChat(){
    let joinData = firebase.database().ref('chatrooms/'+this.data.roomkey+'/chats').push();
    joinData.set({
      type:'join',
      user:this.data.nickname,
      message:this.data.nickname+' has joined this room.',
      sendDate:Date()
    });
    this.data.message = '';
  
    firebase.database().ref('chatrooms/'+this.data.roomkey+'/chats').on('value', resp => {
      this.chats = [];
      this.chats = snapshotToArray(resp);
      setTimeout(() => {
        if(this.offStatus === false) {
          this.content.scrollToBottom(300);
        }
      }, 1000);
    });
  }

  sendMessage() {
    let newData = firebase.database().ref('chatrooms/'+this.data.roomkey+'/chats').push();
    newData.set({
      type:this.data.type,
      user:this.data.nickname,
      message:this.data.message,
      sendDate:Date()
    });
    this.data.message = '';
  }

  exitChat() {
    let exitData = firebase.database().ref('chatrooms/'+this.data.roomkey+'/chats').push();
    exitData.set({
      type:'exit',
      user:this.data.nickname,
      message:this.data.nickname+' has exited this room.',
      sendDate:Date()
    });
    this.offStatus = true;
  
    this.chatManagement = 'name';
  }

  configChat(): void {
    this.navCtrl.push('ConfigChatPage',{'rooms' : this.rooms});
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
