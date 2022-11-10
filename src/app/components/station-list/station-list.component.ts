import { Component, OnInit } from '@angular/core';
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

  constructor(private stationService: StationService) { }

  ngOnInit(): void {
    this.stationService.getProvinces().subscribe((response: Province[]) => {
      response.forEach(province => this.provinces.push(province))});
    this.stationService.getAllStations().subscribe((response: StationPricesResponse) => {
      this.price = "Precio Gasolina 95 E5";
      this.stationPrices = response;
      this.stations = response.ListaEESSPrecio.filter(station => station[this.price] != '')
      this.sort();
    })
    
  }

  changePicked(){
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
        if(this.toNumber(station1[this.price]) < this.toNumber(station2[this.price])){
          return 1;
        }else if(this.toNumber(station1[this.price]) > this.toNumber(station2[this.price])){
          return -1;
        }else{
          return 0;
        }
    });
  }

  sort(){
    this.stations.sort((station1, station2) => {
      if(this.toNumber(station1[this.price]) > this.toNumber(station2[this.price])){
        return 1;
      }else if(this.toNumber(station1[this.price]) < this.toNumber(station2[this.price])){
        return -1;
      }else{
        return 0;
      }
    });
  }

  reFilter(){
    debugger;
    this.stations = this.stationPrices.ListaEESSPrecio.filter(station => station[this.price] != '' && this.toNumber(station[this.price]) > this.minPriceToShow &&  this.toNumber(station[this.price]) < this.maxPriceToShow);
    if(this.provincePicked != '' && this.provincePicked != undefined){
      this.stations = this.stations.filter(station => station['IDProvincia'] == this.provincePicked);
      this.assignMunicipalities();
    }
    if(this.municipalityPicked != '' && this.municipalityPicked != undefined){
      this.stations = this.stations.filter(station => station['IDMunicipio'] == this.municipalityPicked);
    }
    if(this.orderedByLesser){
      this.sort();
    }else{
      this.invertedSort();
    }
  }

  assignMunicipalities(){
    this.stationService.getMunicipalities(this.provincePicked).subscribe((response: Municipality[]) => {
      response.forEach(municipality => this.municipalities.push(municipality))});
  }

}
