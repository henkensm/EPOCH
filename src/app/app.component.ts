import { Component } from '@angular/core';
import { tileLayer, latLng, marker, icon, Map, Popup, Polygon, LatLng, MapOptions, LeafletMouseEvent } from 'leaflet';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  options: MapOptions  = {
    layers: [
      tileLayer(
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
      ),
      marker([ 51.5, -0.09 ], {
        icon: icon({
           iconSize: [ 25, 41 ],
           iconAnchor: [ 13, 41 ],
           iconUrl: 'assets/marker-icon.png',
           shadowUrl: 'assets/marker-shadow.png'
        })
     })
    ],
    zoom: 13,
    center: latLng(51.505, -0.09),
  };

  public polygones: Polygon[] = [];

  private popup: Popup = new Popup();

  private map: Map;

  private polygone: Polygon;

  public onDraw = false;

  private polygonBoundary: LatLng [];

  public onMapReady(event: Map): void {
    this.map = event;
  }


  public onStartPolygone(event: MouseEvent): void {
    console.log(event);
    if (!this.onDraw) {
      this.map.addEventListener('click',  this.drawPolygone, this);
      this.onDraw = true;
    } else {
      this.map.removeEventListener('click', this.drawPolygone, this);
      delete this.polygone;
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
        fillOpacity: 0.5});
    } else {
      this.polygonBoundary.push(event.latlng);
      this.polygone.setLatLngs(this.polygonBoundary);
      if (this.polygonBoundary.length === 3) {
        if(!this.polygones) {
          this.polygones = [];
        }
       this.polygones.push(this.polygone);
      }
    }

  }

}
