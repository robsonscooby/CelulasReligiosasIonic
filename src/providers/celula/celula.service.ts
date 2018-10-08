import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Celula } from './../../model/celula/celula.model';

@Injectable()
export class CelulaService {

  private PATH = 'Celula/';

  constructor(private db: AngularFireDatabase) {
  }

  getAll() {
    return this.db.list(this.PATH, ref => ref.orderByChild('name'))
      .snapshotChanges()
      .map(changes => {
        return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
      })
  }

  get(celula: Celula) {
    return this.db.object(this.PATH + celula.id).snapshotChanges()
      .map(c => {
        return { key: c.key, ...c.payload.val() };
      });
  }

  save(celula: Celula) {
    return new Promise((resolve, reject) => {
      if (celula.id) {
        this.db.list(this.PATH)
          .update(celula.id, {nome: celula.nome,
            descricao: celula.descricao,
            endereco: celula.endereco,
            //site: celula.site,
            telefone: celula.telefone,
            //lat: celula.lat,
            //lng: celula.lng,
            thumbnailId: celula.thumbnailId,
            thumbnailURL: celula.thumbnailURL})
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