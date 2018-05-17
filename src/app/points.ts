import { LatLng } from 'leaflet';
export class Points {

  constructor(lat: LatLng, sequence: number ) {
    this.x = lat.lat;
    this.y = lat.lng;
    this.sequence = sequence;
  }

  private id: string = null;
  private x: number;
  private y: number;
  private sequence: number;
}
