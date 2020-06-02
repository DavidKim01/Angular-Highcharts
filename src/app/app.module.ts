import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HighchartsChartComponent } from 'highcharts-angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { OutputGraphComponent } from './output-graph/output-graph.component';

@NgModule({
  declarations: [
    AppComponent,
    OutputGraphComponent,
    HighchartsChartComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
