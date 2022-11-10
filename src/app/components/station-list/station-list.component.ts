import { Component, OnInit } from '@angular/core';
import { StationPricesResponse } from 'src/app/interfaces/gas-stations.interface';
import { StationService } from 'src/app/services/station.service';

@Component({
  selector: 'app-station-list',
  templateUrl: './station-list.component.html',
  styleUrls: ['./station-list.component.css']
})
export class StationListComponent implements OnInit {

  stationPrices: StationPricesResponse = {} as StationPricesResponse;

  constructor(private stationService: StationService) { }

  ngOnInit(): void {
    this.stationService.getAllStations().subscribe(response => {
      this.stationPrices = response;
    })
  }

}
