import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms'

import * as Highcharts from 'highcharts'
import HC_stock from 'highcharts/modules/stock';
import HC_exporting from 'highcharts/modules/exporting';
import HC_export from 'highcharts/modules/export-data';
import HC_data from 'highcharts/modules/data';
import HC_indicators from 'highcharts/indicators/indicators';
import theme from 'highcharts/themes/dark-unica';

HC_stock(Highcharts);
HC_exporting(Highcharts);
HC_export(Highcharts);
HC_data(Highcharts);
HC_indicators(Highcharts);
theme(Highcharts);

const apiKey: string = 'qPkR3WAyaVxXgh6hFAJi';
const tickerUrl: string = 'https://www.quandl.com/api/v3/datasets/WIKI/';

@Component({
  selector: 'app-build-chart',
  templateUrl: './build-chart.component.html',
  styleUrls: ['./build-chart.component.css']
})
export class BuildChartComponent implements OnInit {

  myForm: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.myForm = this.fb.group({
      email: '',
      message: '',
      career: ''
    })

    this.buildCharts();
  }

  buildCharts() {
    Highcharts.getJSON('https://www.highcharts.com/samples/data/aapl-c.json', function(data) {
      
    let x: Highcharts.SeriesLineOptions[] = [{
      name: 'zen',
      id: '1',
      type: "line",
      data: data,
      lineWidth: 0,
      marker: {
        enabled: true,
        radius: 2,
        symbol: 'square'
      },
      tooltip: {
        valueDecimals: 2
      },
      states: {
        hover: {
          lineWidthPlus: 0
        }
      }
    }];
    let y: Highcharts.SeriesLineOptions = {
      name: 'aapl',
      id: '2',
      type: "line",
      data: data,
      lineWidth: 0,
      marker: {
        enabled: true,
        radius: 2,
        symbol: 'square'
      },
      tooltip: {
        valueDecimals: 2
      },
      states: {
        hover: {
          lineWidthPlus: 0
        }
      }
    };
    
    
    x.push(y);
    
  // Create the chart
  let z = Highcharts.stockChart('container', {


    rangeSelector: {
      selected: 2
    },

    title: {
      text: 'AAPL Stock Price'
    },

    series: x
  });
  let opt: Highcharts.Options = {
    title: {
      text: 'xyz Stock Price'
    }
  }

  setTimeout(function(){ z.update(opt, false, true); }, 5000);
  
});


  }
}
