import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl, Validators } from '@angular/forms'

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

  ngOnInit() {
    this.myForm = this.fb.group({
      seriesType: ['',[
        Validators.required
      ]],
      urls: this.fb.array([])
    });
    this.buildCharts();
  }

  get urlForms() {
    return this.myForm.get('urls') as FormArray;
    
  }

  get seriesType() {
    return this.myForm.get('seriesType');
  }

  validateUrls(): boolean {
    let isEmpty: boolean = false;

    this.urlForms.value.forEach(element => {
      if(element.url.length < 1){
        isEmpty=true;
      }
    });
    return isEmpty;
  }

  resetForms() {
    this.myForm.reset();
  }

  addUrl() {

    const url = this.fb.group({ 
      url: ''
    });

    this.urlForms.push(url);
    let num = [];
    
    console.log(this.urlForms.value.length);
  }

  deleteUrl(i) {
    this.urlForms.removeAt(i);
  }

  submitHandler() {
    console.log("valid data supplied!")
  }

  buildCharts() {
    console.log(this.myForm.value.urls);
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
  let z = Highcharts.stockChart('chart', {


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

  //setTimeout(function(){ z.update(opt, false, true); }, 5000);
  
});


  }
}
