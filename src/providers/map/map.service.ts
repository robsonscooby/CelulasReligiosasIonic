import { Injectable, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { google } from '@google/maps';
import { Celula } from '../../model/celula.model';

declare var google: any;

@Injectable()
export class MapService {

  private map: google.maps.Map;
  private markers: Array<google.maps.Marker> = [];
  private infowindow: google.maps.InfoWindow;

  constructor(private httpClient: HttpClient) { }

  loadMap(mapElement: ElementRef, lat: string, lng: string): void {
    const latLng = new google.maps.LatLng(lat, lng);
    const mapOptions = {
      center: latLng,
      zoom: 10,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.map = new google.maps.Map(mapElement.nativeElement, mapOptions);
  }

  setMarker(element: Celula): void {
    const marker = new google.maps.Marker({
      position: new google.maps.LatLng(element.lat, element.lng),
      map: this.map
    });

    this.infowindow = new google.maps.InfoWindow();
    google.maps.event.addListener(marker, 'click', () => {
      this.map.setCenter(marker.getPosition());
      this.infowindow.setContent(element.nome);
      this.infowindow.open(this.map, marker);
    });
    this.markers.push(marker);
  }

  setLocation(celula: Celula): void {
    const marker = this.markers.find(element => {
      const markerPosition = element.getPosition();
      const selectedPosition = new google.maps.LatLng(celula.lat, celula.lng);
      return markerPosition.lat() === selectedPosition.lat() && markerPosition.lng() === selectedPosition.lng();
    });

    this.map.setCenter(marker.getPosition());
    this.map.setZoom(15);

    this.infowindow.setContent(celula.nome);
    this.infowindow.open(this.map, marker);
  }

  loadCoordinates(address: string): Promise<{ lat: string, lng: string }> {  
    return this.httpClient.get(`https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyCC6kAHTODc2czcEJ4uKOO2JgNXI8uALfA&address=${address}&sensor=true`)
      .toPromise()
      .then((data: any) => {
        if (!data.results.length) {
          return ({ lat: null, lng: null });
        }

        const resp = data.results['0'].geometry.location;
        return ({ lat: resp.lat, lng: resp.lng });
      });
  }
}
