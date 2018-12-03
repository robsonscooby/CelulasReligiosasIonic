import { ConfigProvider } from './../providers/config/config';
import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import firebase from 'firebase/app'
import { FIREBASE_CONFIG } from './firebase.credentials';

@Component({
  templateUrl: 'app.html',
  providers: [
    ConfigProvider
  ]
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage: any;
  pages: Array<{ title: string, component: any }>;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, configProvider: ConfigProvider) {
    this.pages = [
      { title: 'Sobre', component: "AboutPage" },
    ];
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.

      let config = configProvider.getConfigData();
      if (config == null) {
        this.rootPage = 'SlidePage';
        configProvider.setConfigData(false);
      } else {
        this.rootPage = 'LoginPage';
        //this.rootPage = 'ChatPage';
        //this.rootPage = 'HomePage';
        //this.rootPage = 'MapaPage';
        //this.rootPage = 'CadastroCelulaPage';
      }

      statusBar.styleDefault();
      splashScreen.hide();
    });
    firebase.initializeApp(FIREBASE_CONFIG);
  }
  openPage(page) {
    this.nav.push(page.component);
  }
}
