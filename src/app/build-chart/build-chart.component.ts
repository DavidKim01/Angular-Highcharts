import { Component, OnInit } from '@angular/core';
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

  constructor() { }

  ngOnInit(): void {
    this.buildCharts();
  }

  buildCharts() {
    Highcharts.getJSON('https://www.highcharts.com/samples/data/aapl-c.json', function(data) {

  // Create the chart
  Highcharts.stockChart('container', {


    rangeSelector: {
      selected: 2
    },

    title: {
      text: 'AAPL Stock Price'
    },

    series: [{
      name: 'AAPL Stock Price',
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
    }]
  });
});

  }
}
