import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { Grupo } from '../../model/grupo.model';

@Injectable()
export class GrupoService {

  private url: string = 'https://fcm.googleapis.com/fcm/send';
  private PATH = 'grupos/';
  private tk: string = 'key=';
  options = {
    headers: new HttpHeaders({
      'Content-Type':'application/json',
      'Authorization':`${this.tk}`
    })
  }
   private listaGrupos : Observable<Grupo[]>;

  constructor(private http: HttpClient, private db: AngularFireDatabase) {

     this.listaGrupos = this. getAll();

    this.listaGrupos.subscribe((grupos) => {
      grupos.forEach( g => {
        this.teste(g.tk);
      });
    });
  }

   getAll() {
    return this.db.list(this.PATH, ref => ref.orderByChild('tk'))
      .snapshotChanges()
      .map(changes => {
        return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
      })
  }

  teste(tk) {
    let body = 
       {
         "notification": {
             "title": "Notification title",
             "body": "Notification body",
             "sound": "default",
             "click_action": "FCM_PLUGIN_ACTIVITY",
             "icon": "fcm_push_icon"
         },
         "data": {
             "hello": "This is a Firebase Cloud Messagin  hbhj g Device Gr new v Message!",
         },
         "to": tk
       };

      this.http.post(this.url, body, this.options).map(response => {
        return response;
      }).subscribe(data => {
         //post doesn't fire if it doesn't get subscribed to
         console.log(data);
      });
  }
  
}