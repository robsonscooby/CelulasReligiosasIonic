import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CadastroCelulaPage } from './cadastro-celula';
import { EnderecoProvider } from '../../providers/endereco/endereco';
import { IonMaskModule } from '@pluritech/ion-mask';
import { MapService } from '../../providers/map/map.service';

@NgModule({
  declarations: [
    CadastroCelulaPage,
  ],
  imports: [
    IonicPageModule.forChild(CadastroCelulaPage),
    IonMaskModule.forRoot()
  ],
  providers: [
    EnderecoProvider,
    MapService
  ]
})
export class CadastroCelulaPageModule {}
