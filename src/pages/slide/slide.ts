import { Component } from '@angular/core';
import { IonicPage, NavController} from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-slide',
  templateUrl: 'slide.html',
})
export class SlidePage {

  slides = [  
    {
      title: "Bem Vindo!",
      description: "O aplicativo <b>Celulas Religiosas</b> irá lhe guiar de forma rápida e prática, onde encontrar Celulas de estudos biblicos mas proximo de você.",
      image: "assets/imgs/ica-slidebox-img-1.png",
    },
    {
      title: "Localizar Celulas?",
      description: "<b>Com apenas um clique</b> será exibido a localização no mapa de todas as Celulas de estudos biblicos de sua Igreja.",
      image: "assets/imgs/ica-slidebox-img-2.png",
    },
    {
      title: "Notícias",
      description: "<b>Você</b> será sempre atualizado sobre os eventos que esta acontecendo na sua Igreja.",
      image: "assets/imgs/ica-slidebox-img-3.png",
    }
  ];

  constructor(public navCtrl: NavController) {}

  home() {
    this.navCtrl.push('TabsPage');
  }

}
