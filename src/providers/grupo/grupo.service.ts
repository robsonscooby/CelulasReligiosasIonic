import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { Grupo } from '../../model/grupo.model';
import { Celula } from '../../model/celula.model';

@Injectable()
export class GrupoService {

  private url: string = 'https://fcm.googleapis.com/fcm/send';
  private PATH = 'grupos/';
  privte tk: string = 'key=_rEyow2rZv29TnPggzMici119_0TM7Yul7gzgWzEZ-QrX'
  options = {
    headers: new HttpHeaders({
      'Content-Type':'application/json',
      'Authorization':`${this.tk}`
    })
  }
   private listaGrupos : Observable<Grupo[]>;

  constructor(private http: HttpClient, private db: AngularFireDatabase) {
  }

  sendNotification(celula: Celula): void {
    this.listaGrupos = this.getAll(celula.code);
    this.listaGrupos.subscribe((grupos) => {
      grupos.forEach( g => {
        this.prepare(celula.nome, g.tk);
      });
    });
  }

  save(grupo: Grupo): Promise<Grupo> {
    return new Promise((resolve, reject) => {
      if (grupo.key) {
        this.db.list(this.PATH)
          .update(grupo.key, grupo)
          .then(() => resolve())
          .catch((e) => reject(e));
      } else {
        this.db.list(this.PATH)
          .push(grupo)
          .then(() => resolve());
      }
    })
  }

   getAll(code: string): Observable<Grupo[]> {
    return this.db.list(this.PATH, ref => ref.orderByChild('code').equalTo(code))
      .snapshotChanges()
      .map(changes => {
        return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
      })
  }

  prepare(msg: string, tk: string): void {
    let body = 
       {
         "notification": {
             "title": "Nova Celula de Estudo",
             "body": msg,
             "sound": "default",
             "click_action": "https://celulasreligiosas.firebaseapp.com",
             "icon": "assets/imgs/logo.png"
         },
        //  "data": {
        //      "hello": "This is a Firebase Cloud Messagin  hbhj g Device Gr new v Message!",
        //  },
         "to": tk
       };

      this.http.post(this.url, body, this.options).map(response => {
        return response;
      }).subscribe(data => {
         //post doesn't fire if it doesn't get subscribed to
         //console.log(data);
      });
  }
  
}