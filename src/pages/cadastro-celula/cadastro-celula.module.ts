import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CadastroCelulaPage } from './cadastro-celula';
import { EnderecoProvider } from '../../providers/endereco/endereco';
// Import your library
import { IonMaskModule } from '@pluritech/ion-mask';

@NgModule({
  declarations: [
    CadastroCelulaPage,
  ],
  imports: [
    IonicPageModule.forChild(CadastroCelulaPage),
    // import the module
    IonMaskModule.forRoot()
  ],
  providers: [
    EnderecoProvider
  ]
})
export class CadastroCelulaPageModule {}
