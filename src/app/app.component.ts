import { ConfigProvider } from './../providers/config/config';
import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

@Component({
  templateUrl: 'app.html',
  providers:[
    ConfigProvider
  ]
})
export class MyApp {
  rootPage:any;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, configProvider: ConfigProvider) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.

      let config = configProvider.getConfigData();
      if(config == null) {
        this.rootPage = 'SlidePage';
        configProvider.setConfigData(false);
      }else{
        this.rootPage = 'LoginPage';
        //this.rootPage = 'HomePage';
        //this.rootPage = 'AboutPage';
        //this.rootPage = 'CadastroCelulaPage';
      }

      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}
