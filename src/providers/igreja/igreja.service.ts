import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Igreja } from '../../model/igreja.model';

@Injectable()
export class IgrejaService {

  private PATH = 'Igrejas/';

  constructor(private db: AngularFireDatabase) {
  }

  getUser(email: string) {
    return this.db.list(this.PATH, ref => ref.orderByChild('email').equalTo(email))
      .snapshotChanges()
      .map(changes => {
        return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
      });
  }


  get(igreja: Igreja) {
    return this.db.object(this.PATH + igreja.key)
    .snapshotChanges()
      .map(c => {
        return { key: c.key, ...c.payload.val() };
      });
  }

  save(igreja: Igreja) {
    return new Promise((resolve, reject) => {
      if (igreja.key) {
        this.db.list(this.PATH)
          .update(igreja.key, igreja)
          .then(() => resolve())
          .catch((e) => reject(e));
      } else {
        this.db.list(this.PATH)
          .push(igreja)
          .then(() => resolve());
      }
    })
  }

  remove(key: string) {
    return this.db.list(this.PATH).remove(key);
  }
}