import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Celula } from './../../model/celula/celula.model';

@Injectable()
export class CelulaService {

  private PATH = 'Celulas/';

  constructor(private db: AngularFireDatabase) {
  }

  getAll() {
    return this.db.list(this.PATH, ref => ref.orderByChild('nome'))
      .snapshotChanges()
      .map(changes => {
        return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
      })
  }

  get(celula: Celula) {
    return this.db.object(this.PATH + celula.key).snapshotChanges()
      .map(c => {
        return { key: c.key, ...c.payload.val() };
      });
  }

  save(celula: Celula) {
    return new Promise((resolve, reject) => {
      if (celula.key) {
        this.db.list(this.PATH)
          .update(celula.key, celula)
          .then(() => resolve())
          .catch((e) => reject(e));
      } else {
        this.db.list(this.PATH)
          .push(celula)
          .then(() => resolve());
      }
    })
  }

  remove(key: string) {
    return this.db.list(this.PATH).remove(key);
  }
}