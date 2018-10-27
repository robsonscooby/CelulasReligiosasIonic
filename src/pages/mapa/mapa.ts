import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { Celula } from '../../model/celula.model';
import { MapService } from '../../providers/map/map.service';

@IonicPage()
@Component({
  selector: 'page-mapa',
  templateUrl: 'mapa.html'
})
export class MapaPage {
  @ViewChild('map') mapElement: ElementRef;
  
  private celulaList: Observable<Celula[]>
  celula: Celula = new Celula();

  constructor(public params: NavParams, private mapService: MapService) {
    this.celulaList = params.data;
    this.celulaList.subscribe(celulas => {
      if(celulas.length > 0){
        this.mapService.loadMap(this.mapElement, celulas[0].lat, celulas[0].lng);
      }
      celulas.map(element => this.mapService.setMarker(element));
    });
  } 

  selectCelula(): void {
    this.celulaList.subscribe(cel => {
      cel.filter((c) => {
        if(c.nome == this.celula.nome){
          this.mapService.setLocation(c);
        }
      });
    });
  }
  
}