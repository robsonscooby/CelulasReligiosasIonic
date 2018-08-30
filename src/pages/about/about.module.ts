import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AboutPage } from './about';
import { MapService } from '../../providers/map/map.service';


@NgModule({
  declarations: [
    AboutPage,
  ],
  imports: [
    IonicPageModule.forChild(AboutPage),
  ],
  providers: [
    MapService,
  ]
})
export class Exemplo1PageModule {}
