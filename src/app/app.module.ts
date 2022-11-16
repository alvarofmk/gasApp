import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StationListComponent } from './components/station-list/station-list.component';
import { MaterialImportsModule } from './material-imports/material-imports.module';
import { FormsModule } from '@angular/forms';
import { StationsMapComponent } from './components/stations-map/stations-map.component';
import { GoogleMapsModule } from '@angular/google-maps';



@NgModule({
  declarations: [
    AppComponent,
    StationListComponent,
    StationsMapComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MaterialImportsModule,
    FormsModule,
    GoogleMapsModule
  ],
  exports: [
    MaterialImportsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
