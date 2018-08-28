import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Celula } from './../../model/celula/celula.model';

@Injectable()
export class CelulaService {

    private celulaListRef = this.db.list<Celula>('Celula');

    constructor(private db: AngularFireDatabase) { }

    getCelulaList() {
        return this.celulaListRef;
    }

    addCelula(celula: Celula) {
        return this.celulaListRef.push(celula);
    }

    updateCelula(celula: Celula) {
        return this.celulaListRef.update(celula.key, celula);
    }

    removeCelula(celula: Celula) {
        return this.celulaListRef.remove(celula.key);
    }
}