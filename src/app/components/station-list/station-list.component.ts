import { Component, OnInit } from '@angular/core';
import { StationPrices, StationPricesResponse } from 'src/app/interfaces/gas-stations.interface';
import { StationService } from 'src/app/services/station.service';

@Component({
  selector: 'app-station-list',
  templateUrl: './station-list.component.html',
  styleUrls: ['./station-list.component.css']
})
export class StationListComponent implements OnInit {

  stations: StationPrices[] = [];
  stationExample: StationPrices = {} as StationPrices;
  stationPrices: StationPricesResponse = {} as StationPricesResponse;
  pricePicked: number = 0;
  price: keyof typeof this.stationExample = "Precio Gasolina 95 E5";

  constructor(private stationService: StationService) { }

  ngOnInit(): void {
    this.stationService.getAllStations().subscribe(response => {
      debugger;
      this.price = "Precio Gasolina 95 E5";
      this.stationPrices = response;
      this.stations = response.ListaEESSPrecio.filter(station => station[this.price] != '')
      this.stations = this.stations.sort((station1, station2) => parseFloat(station1[this.price]) - parseFloat(station2[this.price]));
    })
  }

  changePicked(){
    switch (this.pricePicked) {
      case 1:
        this.price = 'Precio Biodiesel';
        break;
      case 2:
        this.price = 'Precio Bioetanol';
        break;
      case 3:
        this.price = 'Precio Gas Natural Comprimido';
        break;
      case 4:
        this.price = 'Precio Gasoleo A';
        break;
      case 5:
        this.price = 'Precio Gasoleo Premium';
        break;
      case 6:
        this.price = 'Precio Gasolina 95 E5';
        break;
      case 7:
        this.price = 'Precio Gasolina 98 E5';
        break;
      case 8:
        this.price = 'Precio Hidrogeno';
        break; 
      default:
        this.price = 'Precio Gasolina 95 E5';
        break;
    }
  }

}
