import { Component, ChangeDetectorRef } from '@angular/core';
import { tileLayer, latLng, marker, icon, Map, Popup, Polygon,
  LatLng, MapOptions, LeafletMouseEvent, CRS, imageOverlay, bounds, Bounds, LatLngBounds } from 'leaflet';
import { Alert } from 'selenium-webdriver';
import { StompService } from '@stomp/ng2-stompjs';
import { Message } from '@stomp/stompjs';
import { Polygone } from './polygone';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  options: MapOptions  = {
    layers: [
      /*tileLayer(
        'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}',
        {
          maxZoom: 18,
          attribution:
            'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors,'
            + '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>,' +
            'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            id: 'mapbox.streets',
            accessToken: 'pk.eyJ1IjoiaGVua2Vuc20iLCJhIjoiY2pnejk0dmozMjY4dDMzcWp0N3d0M3hzbSJ9.Nw6Zuz1vpmXlvwq_TTqLDQ'
        }
      ),*/
      imageOverlay('assets/Anuire.jpg', new LatLngBounds([0, 0], [1100, 1027]) ),
      marker([ 51.5, -0.09 ], {
        icon: icon({
           iconSize: [ 25, 41 ],
           iconAnchor: [ 13, 41 ],
           iconUrl: 'assets/marker-icon.png',
           shadowUrl: 'assets/marker-shadow.png'
        })
     })
    ],
    crs: CRS.Simple,
    zoom: 1,
    minZoom: -5,
    center: latLng(500, 500),
  };

  public polygones: Polygon[] = [];

  private popup: Popup = new Popup();

  private map: Map;

  private polygone: Polygon;

  public onDraw = false;

  private polygonBoundary: LatLng [];

  public textInput: string;

  public poly: Polygone[] = [];

  constructor (private changeDetectorRef: ChangeDetectorRef, private stompService: StompService) {
    this.onConnect();
  }

  private stompSubscription;

  public onConnect(): void {
    this.stompSubscription = this.stompService.subscribe('/topic/polygone/list');

    this.stompSubscription.subscribe((msg_body: Message) => {
      const json: any = JSON.parse(msg_body.body);
      let found = false;
      for (const p of this.poly) {
        if (p.id === json.id) {
          p.points = json.points;
          found = true;
        }
      }

      if (!found) {
        this.poly.push(json);
      }

    });
  }

  public onMapReady(event: Map): void {
    this.map = event;
  }

  public onSend(): void {

  }


  public onStartPolygone(event: MouseEvent): void {
    console.log(event);
    if (!this.onDraw) {
      this.map.addEventListener('click',  this.drawPolygone, this);
      this.onDraw = true;
    } else {
      this.map.removeEventListener('click', this.drawPolygone, this);
      this.stompService.publish('/app/polygone/save', JSON.stringify(new Polygone(this.polygone)));
      delete this.polygone;
      delete this.polygonBoundary;
      this.onDraw = false;
    }
  }



  public drawPolygone(event: LeafletMouseEvent): void {
     console.log(event);
    if (!this.polygone) {
      this.polygonBoundary = [event.latlng];
      this.polygone = new Polygon([event.latlng],
        {color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.01});
    } else {
      this.polygonBoundary.push(event.latlng);
      this.polygone.setLatLngs(this.polygonBoundary);
      // this.changeDetectorRef.detectChanges();
      this.changeDetectorRef.markForCheck();
      if (this.polygonBoundary.length === 3) {
        this.polygone.addEventListener('click' , (evt: LeafletMouseEvent) => {
          alert('polygone click');
        }, this);
          this.polygones.push(this.polygone);
          this.map.addLayer(this.polygone);
      }
    }

  }

}
