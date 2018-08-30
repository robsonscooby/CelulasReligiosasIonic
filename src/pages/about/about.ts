import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { Celula } from '../../model/celula/celula.model';
import { MapService } from '../../providers/map/map.service';

@IonicPage()
@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
  @ViewChild('map') mapElement: ElementRef;
  
  private celulaList: Observable<Celula[]>

  constructor(public params: NavParams, private mapService: MapService) {
    this.celulaList = params.data;
    this.celulaList.subscribe(celulas => {
      this.mapService.loadMap(this.mapElement, celulas[0].lat, celulas[0].lng);
      celulas.map(element => this.mapService.setMarker(element));
    });
  } 
}