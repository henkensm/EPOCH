import { Points } from './points';
import { Polygon, LatLng } from 'leaflet';

export class Polygone {

  public constructor(polygon: Polygon) {
    this.points = [];
    let sequence = 0;
    for (const latArr of <LatLng[][]> polygon.getLatLngs()) {
      for (const lat of latArr) {
        this.points.push(new Points(lat, sequence));
        sequence++;
      }
    }
  }

  public id: string = null;
  public points: Points[];
}
