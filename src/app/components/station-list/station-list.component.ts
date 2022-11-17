import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable, map, catchError, of } from 'rxjs';
import { StationPrices, StationPricesResponse } from 'src/app/interfaces/gas-stations.interface';
import { Municipality } from 'src/app/interfaces/municipalities.interface';
import { Province, ProvinceResponse } from 'src/app/interfaces/province.interface';
import { StationService } from 'src/app/services/station.service';

@Component({
  selector: 'app-station-list',
  templateUrl: './station-list.component.html',
  styleUrls: ['./station-list.component.css']
})
export class StationListComponent implements OnInit {

  municipalities: Municipality[] = [];
  provinces: Province[] = [];
  stations: StationPrices[] = [];
  stationExample: StationPrices = {} as StationPrices;
  stationPrices: StationPricesResponse = {} as StationPricesResponse;
  pricePicked: number = 0;
  provincePicked: string = '';
  municipalityPicked: string = '';
  price: keyof typeof this.stationExample = "Precio Gasolina 95 E5";
  orderedByLesser: boolean = true;
  minPriceToShow: number = 0;
  maxPriceToShow: number = 5.00;
  loading: boolean = true;
  userLat: number = 0;
  userLng: number = 0;
  
  geoLocalized: boolean = false;
  userCoordinates: google.maps.LatLngLiteral = {} as google.maps.LatLngLiteral;

  constructor(private stationService: StationService) { }

  ngOnInit(): void {
    this.getLocation();
    console.log(this.userLat);
    console.log(this.userLng);
    this.stationService.getProvinces().subscribe((response: Province[]) => {
      response.forEach(province => this.provinces.push(province))});
    this.stationService.getAllStations().subscribe((response: StationPricesResponse) => {
      this.price = "Precio Gasolina 95 E5";
      this.stationPrices = response;
      this.stations = response.ListaEESSPrecio.filter(station => station[this.price] != '')
      this.stations.forEach(station => station['googlePosition'] = this.getPositionAsLatLngLiteral(station));
      this.sort();
      this.loading = false;
    })
    
  }

  changePicked(){
    debugger;
    this.loading = true;
    switch (this.pricePicked) {
      case 1:
        this.price = 'Precio Biodiesel';
        this.reFilter();
        break;
      case 2:
        this.price = 'Precio Bioetanol';
        this.reFilter();
        break;
      case 3:
        this.price = 'Precio Gas Natural Comprimido';
        this.reFilter();
        break;
      case 4:
        this.price = 'Precio Gasoleo A';
        this.reFilter();
        break;
      case 5:
        this.price = 'Precio Gasoleo Premium';
        this.reFilter();
        break;
      case 6:
        this.price = 'Precio Gasolina 95 E5';
        this.reFilter();
        break;
      case 7:
        this.price = 'Precio Gasolina 98 E5';
        this.reFilter();
        break;
      case 8:
        this.price = 'Precio Hidrogeno';
        this.reFilter();
        break; 
      default:
        this.price = 'Precio Gasolina 95 E5';
        this.reFilter();
        break;
    }
  }

  toNumber(stringValue: string){
    if(stringValue.includes(',')){
      return Number(stringValue.split(',')[0]) + Number(stringValue.split(',')[1]) / (Math.pow(10, stringValue.split(',')[1].length))
    }else{
      return Number(stringValue);
    }
  }

  invertSort(){
    if(this.orderedByLesser){
      this.orderedByLesser = !this.orderedByLesser;
      this.invertedSort();
    }else{
      this.orderedByLesser = !this.orderedByLesser;
      this.sort();
    }
  }

  invertedSort(){
      this.stations.sort((station1, station2) => {
        if(this.toNumber(station1[this.price] as string) < this.toNumber(station2[this.price] as string)){
          return 1;
        }else if(this.toNumber(station1[this.price] as string) > this.toNumber(station2[this.price] as string)){
          return -1;
        }else{
          return 0;
        }
    });
  }

  sort(){
    this.stations.sort((station1, station2) => {
      if(this.toNumber(station1[this.price] as string) > this.toNumber(station2[this.price] as string)){
        return 1;
      }else if(this.toNumber(station1[this.price] as string) < this.toNumber(station2[this.price] as string)){
        return -1;
      }else{
        return 0;
      }
    });
  }

  sortByClosest(){
    this.stations.sort((station1, station2) => {
      if(this.calculateDistance(station1) > this.calculateDistance(station2)){
        return 1;
      }else if(this.calculateDistance(station1) < this.calculateDistance(station2)){
        return -1;
      }else{
        return 0;
      }
    });
  }

  reFilter(){
    this.stations = this.stationPrices.ListaEESSPrecio.filter(station => station[this.price] != '' && this.toNumber(station[this.price] as string) > this.minPriceToShow &&  this.toNumber(station[this.price] as string) < this.maxPriceToShow);
    if(this.provincePicked != '' && this.provincePicked != undefined){
      this.stations = this.stations.filter(station => station['IDProvincia'] == this.provincePicked);
      this.assignMunicipalities();
    }else{
      this.municipalityPicked = '';
    }
    if(this.municipalityPicked != '' && this.municipalityPicked != undefined){
      this.stations = this.stations.filter(station => station['IDMunicipio'] == this.municipalityPicked);
    }
    if(this.orderedByLesser){
      this.sort();
    }else{
      this.invertedSort();
    }
    this.loading = false;
  }

  assignMunicipalities(){
    this.stationService.getMunicipalities(this.provincePicked).subscribe((response: Municipality[]) => {
      response.forEach(municipality => this.municipalities.push(municipality))});
  }

  openLocation(gasStation: StationPrices){
    debugger;
    window.open(`https://www.google.es/maps/dir/${this.userLat},${this.userLng}/${gasStation['Latitud'].replace(",",".")},${gasStation['Longitud (WGS84)'].replace(",",".")}`, "_blank");
  }

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        if (position) {
          console.log("Latitude: " + position.coords.latitude +
            "Longitude: " + position.coords.longitude);
          this.userLat = position.coords.latitude;
          this.userLng = position.coords.longitude;
          console.log(this.userLat);
          console.log(this.userLng);
          this.geoLocalized = true;
          this.userCoordinates = {lat: this.userLat, lng: this.userLng};
        }
      },
        (error) => console.log(error));
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }

  calculateDistance(station: StationPrices): number{
    // The math module contains a function
    // named toRadians which converts from
    // degrees to radians.
    let userLat = this.userLat * Math.PI / 180;
    let userLon = this.userLng * Math.PI / 180;

    let stationLon = this.toNumber(station['Longitud (WGS84)']) * Math.PI / 180;
    let stationLat = this.toNumber(station['Latitud']) * Math.PI / 180;

    // Haversine formula
    let dlon = userLon - stationLon;
    let dlat = userLat - stationLat;
    let a = Math.pow(Math.sin(dlat / 2), 2)
    + Math.cos(userLat) * Math.cos(stationLat)
    * Math.pow(Math.sin(dlon / 2),2);

    let c = 2 * Math.asin(Math.sqrt(a));

    // Radius of earth in kilometers.
    let r = 6371;

    // calculate the result
    return Math.round((c * r) * 100) / 100;
  }

  getPositionAsLatLngLiteral(station: StationPrices): google.maps.LatLngLiteral{
    return {lat: Number(station.Latitud.replace(",",".")), lng: Number(station['Longitud (WGS84)'].replace(",","."))};
  }

}
