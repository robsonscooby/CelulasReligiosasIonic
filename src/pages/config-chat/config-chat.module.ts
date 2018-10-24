import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ConfigChatPage } from './config-chat';

@NgModule({
  declarations: [
    ConfigChatPage,
  ],
  imports: [
    IonicPageModule.forChild(ConfigChatPage),
  ],
})
export class ConfigChatPageModule {}
