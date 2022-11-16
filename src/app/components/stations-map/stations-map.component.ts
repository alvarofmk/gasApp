import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MapInfoWindow, MapMarker } from '@angular/google-maps';
import { StationPrices } from 'src/app/interfaces/gas-stations.interface';

@Component({
  selector: 'app-stations-map',
  templateUrl: './stations-map.component.html'
})
export class StationsMapComponent implements OnInit {

  @Input()
  stationsList: StationPrices[] = [];

  @Input()
  userCoordinates: google.maps.LatLngLiteral = {} as google.maps.LatLngLiteral;
  
  @ViewChild(MapInfoWindow)
  infoWindow!: MapInfoWindow;

  infoWindowSelected: StationPrices = {} as StationPrices;

  constructor() {
  }

  ngOnInit(): void {
    this.stationsList.forEach(station => station['googlePosition'] = this.getPositionAsLatLngLiteral(station));
    debugger;
  }

  getPositionAsLatLngLiteral(station: StationPrices): google.maps.LatLngLiteral{
    return {lat: Number(station.Latitud.replace(",",".")), lng: Number(station['Longitud (WGS84)'].replace(",","."))};
  }

  openInfoWindow(marker: MapMarker, station: StationPrices) {
    this.infoWindowSelected = station;
    this.infoWindow.open(marker);
  }

}
