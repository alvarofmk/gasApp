import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { StationPrices, StationPricesResponse } from '../interfaces/gas-stations.interface';
import { Municipality } from '../interfaces/municipalities.interface';
import { Province, ProvinceResponse } from '../interfaces/province.interface';

@Injectable({
  providedIn: 'root'
})
export class StationService {

  constructor(private http: HttpClient) { }

  getAllStations():Observable<StationPricesResponse>{
    return this.http.get<StationPricesResponse>(`https://raw.githubusercontent.com/alvarofmk/gasApp/master/src/assets/gasStations`)
  }

  getProvinces():Observable<Province[]>{
    return this.http.get<Province[]>("https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/Listados/Provincias/")
  }

  getMunicipalities(provinceId: string):Observable<Municipality[]>{
    return this.http.get<Municipality[]>(`https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/Listados/MunicipiosPorProvincia/${provinceId}`)
  }

}
