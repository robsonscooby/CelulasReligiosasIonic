import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { CelulaService } from '../../providers/celula/celula.service';
import { Observable } from 'rxjs/Observable';
import { Celula } from '../../model/celula/celula.model';

@IonicPage()
@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = 'HomePage';
  tab2Root = 'AboutPage';
  tab3Root = 'ContactPage';

  celulaList: Observable<Celula[]>

  constructor(private celulaService: CelulaService) {
    this.getFromFirebaseAsync();
  }
  
  async getFromFirebaseAsync(){
    this.celulaList = await this.celulaService.getAll();
  }
}