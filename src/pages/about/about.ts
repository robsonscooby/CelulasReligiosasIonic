import { Component } from '@angular/core';
import { IonicPage, NavParams } from 'ionic-angular';
import { CelulaService } from '../../providers/celula/celula.service';
import { Observable } from 'rxjs/Observable';
import { Celula } from '../../model/celula/celula.model';

declare var google;

/**
 * https://developers.google.com/maps/documentation/javascript/adding-a-google-map
 */
@IonicPage()
@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
  
  map: any;
  geocoder;
  celulaList: Observable<Celula[]>

  constructor(private celulaService: CelulaService, public params: NavParams) {
    this.geocoder = new google.maps.Geocoder();
    this.celulaList = params.data;
    this.celulaList.subscribe(recent => {
      this.marcarMapa(recent);
    });
  }

  ionViewDidLoad() {
    //this.getFromFirebaseAsync()
    // .then(async (lista) => {
    //   this.montarCelulas(lista).then((posicao) =>{
    //     this.marcarMapa(posicao);
    //   })
    // }) 
  }

  // getFromFirebaseAsync(): Promise<any>{
  //   return new Promise((resolve, reject) => {
  //     this.celulaList = this.celulaService.getCelulaList()
  //       .snapshotChanges()
  //       .map(
  //       changes => {
  //         return changes.map(c => ({
  //           key: c.payload.key, ...c.payload.val()
  //         }))
  //       });
  //       if(this.celulaList != undefined){
  //         this.celulaList.subscribe(lista => {
  //           resolve(lista);
  //         });  
  //       }else{
  //         reject('Erro ao tentar buscar celulas!');
  //       }
  //   });
  // }

 marcarMapa(lista):Promise<any>{
    return new Promise((resolve,reject) => {
      let position = new google.maps.LatLng(-7.930114, -34.8562304);

      let mapOptions = {
        zoom: 30,
        center: position,
        //disableDefaultUI: true
      }

      this.map = new google.maps.Map(document.getElementById('map'), mapOptions);
      
      var infowindow = new google.maps.InfoWindow();
      
      var marker, i;
      
      for (i = 0; i < lista.length; i++) {  
        marker = new google.maps.Marker({
          position: new google.maps.LatLng(lista[i][1], lista[i][2]),
          map: this.map
        });
      
        google.maps.event.addListener(marker, 'click', (function(marker, i) {
          return function() {
            infowindow.setContent(lista[i][0]);
            infowindow.open(this.map, marker);
            resolve();
          }
        })(marker, i));
      }
    });
      
  }

  montarCelulas(lista):Promise<any>{
    return new Promise( async (resolve, reject) =>{
      let posicao = [];
      for (let index = 0; index < lista.length; index++) {
        posicao.push(await this.buscarPosicao(lista[index]));
      }
      resolve(posicao);
    });
  }

  buscarPosicao(element): Promise<any>{
    return new Promise((resolve, reject) => {
      this.geocoder.geocode( { 'address': element.endereco}, function(results, status) {
        let lat = '';
        let lng = '';
        if (status == google.maps.GeocoderStatus.OK) {
          lat = results[0].geometry.location.lat();
          lng = results[0].geometry.location.lng();
          resolve([element.nome,lat,lng]);
        } else {
          console.error("Não foi possivel obter localização: " + status);
          reject();
        }
      });
    });
  }
}