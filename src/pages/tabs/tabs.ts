import { Component } from '@angular/core';
import { IonicPage, NavParams } from 'ionic-angular';
import { CelulaService } from '../../providers/celula/celula.service';
import { Observable } from 'rxjs/Observable';
import { Celula } from '../../model/celula.model';
import { AuthService } from '../../providers/auth/auth-service';

@IonicPage()
@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = 'HomePage';
  tab2Root = 'MapaPage';
  tab3Root = 'ChatPage';
  tab4Root = 'ContactPage';

  celulaList: Observable<Celula[]>

  constructor(
    private celulaService: CelulaService,
    public params: NavParams,
    public authService: AuthService) {

    this.getFromFirebaseAsync();
  }
  
  async getFromFirebaseAsync(){
    this.celulaList = await this.celulaService.getAll(this.authService.getCode());
  }
}