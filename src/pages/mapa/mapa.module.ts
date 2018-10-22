import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MapaPage } from './mapa';
import { MapService } from '../../providers/map/map.service';


@NgModule({
  declarations: [
    MapaPage,
  ],
  imports: [
    IonicPageModule.forChild(MapaPage),
  ],
  providers: [
    MapService,
  ]
})
export class Exemplo1PageModule {}
