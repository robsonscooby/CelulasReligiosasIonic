import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RegisterPage } from './register';
import { IonMaskModule } from '@pluritech/ion-mask';

@NgModule({
  declarations: [
    RegisterPage,
  ],
  imports: [
    IonicPageModule.forChild(RegisterPage),
    IonMaskModule.forRoot()
  ],
  exports: [
    RegisterPage
  ]
})
export class RegisterPageModule {}
