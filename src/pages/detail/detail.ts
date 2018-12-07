import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Celula } from '../../model/celula.model';

@IonicPage()
@Component({
  selector: 'page-detail',
  templateUrl: 'detail.html',
})
export class DetailPage {

  celula: Celula;
  private selectedFile: { data: any, base64: string } = { data: null, base64: null };

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    let cel = navParams.get('celula')  
    if(cel){
      this.celula = cel;
      this.selectedFile.base64 = this.celula.thumbnailURL;
    }
  }

  ionViewDidLoad() {}

}
