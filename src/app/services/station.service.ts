import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { StationPrices, StationPricesResponse } from '../interfaces/gas-stations.interface';

@Injectable({
  providedIn: 'root'
})
export class StationService {

  constructor(private http: HttpClient) { }

  getAllStations():Observable<StationPricesResponse>{
    return this.http.get<StationPricesResponse>(`${environment.API_URL_BASE}/EstacionesTerrestres/`)
  }

}
