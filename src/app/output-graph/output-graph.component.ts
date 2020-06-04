import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts'
import HC_stock from 'highcharts/modules/stock';
import HC_export from 'highcharts/modules/exporting';
import HC_data from 'highcharts/modules/data';
import HC_drag from 'highcharts/modules/drag-panes';
import HC_indicators from 'highcharts/indicators/indicators';
import HC_vbp from 'highcharts/indicators/volume-by-price';
import { HttpClient } from '@angular/common/http';
import { interval, Subscription } from 'rxjs';

HC_stock(Highcharts);
HC_export(Highcharts);
HC_data(Highcharts);
HC_indicators(Highcharts);
HC_drag(Highcharts);
HC_vbp(Highcharts);

declare var require: any;
let Boost = require('highcharts/modules/boost');
let noData = require('highcharts/modules/no-data-to-display');
let More = require('highcharts/highcharts-more');

Boost(Highcharts);
noData(Highcharts);
More(Highcharts);
noData(Highcharts);

@Component({
  selector: 'app-output-graph',
  templateUrl: './output-graph.component.html',
  styleUrls: ['./output-graph.component.css']
})
export class OutputGraphComponent implements OnInit {

  ngOnInit(): void {
    let apiKey: string = "qPkR3WAyaVxXgh6hFAJi";
    let tickerUrl: string = "https://www.quandl.com/api/v3/datasets/WIKI/";
    let tickerChoice: string = "AAPL";

    Highcharts.getJSON(`${tickerUrl}${tickerChoice}.json?api_key=${apiKey}`, function (data) {
      let parsedData = data.dataset.data.map((entry) => {
        return entry.slice(0, 5);
      });
      let d = new Date();
      let n = d.getTime();
      let altered = parsedData.forEach((entry) => {
        let dateArray: string[] = entry[0].split('-');
        let dd: Date = new Date(parseInt(dateArray[0], 10), parseInt(dateArray[1], 10) - 1, parseInt(dateArray[2], 10));
        entry[0] = dd.getTime();
      })
      console.log(parsedData);
      Highcharts.stockChart('container', {
        
        title: {
          text: 'AAPL Stock Price'
        },

        rangeSelector: {
          buttons: [{
            type: 'week',
            count: 1,
            text: '1w'
          }, {
            type: 'month',
            count: 1,
            text: '1m'
          }, {
            type: 'month',
            count: 3,
            text: '3m'
          }, {
            type: 'month',
            count: 6,
            text: '6m'
          }, {
            type: 'year',
            count: 1,
            text: '1y'
          }, {
            type: 'ytd',
            text: 'YTD'
          }, {
            type: 'all',
            text: 'All'
          }],
          selected: 3
        },

        series: [{
          type: 'ohlc',
          id: 'aapl',
          name: 'AAPL Stock Price',
          data: parsedData.reverse(),
          dataGrouping: {
            units: [[
              'day',
              [1]
            ]]
          }
        },
        {
          type: 'sma',
          name: 'Smart Moving Average 25-day',
          linkedTo: 'aapl',
          color: 'blue',
          dataGrouping: {
            approximation: 'averages',
            groupPixelWidth: 25,
            units: [[
              'day',
              [25]
            ]]
          }
        },
        {
          type: 'sma',
          name: 'Smart Moving Average 200-day',
          linkedTo: 'aapl',
          color: 'red',
          dataGrouping: {
            approximation: 'averages',
            groupPixelWidth: 200,
            units: [[
              'day',
              [200]
            ]]
          }
        }
        ]
      })

      Highcharts.stockChart('container-2', {

        title: {
          text: 'AAPL Historical'
        },

        rangeSelector: {
          buttons: [{
            type: 'week',
            count: 1,
            text: '1w'
          }, {
            type: 'month',
            count: 1,
            text: '1m'
          }, {
            type: 'month',
            count: 3,
            text: '3m'
          }, {
            type: 'month',
            count: 6,
            text: '6m'
          }, {
            type: 'year',
            count: 1,
            text: '1y'
          }, {
            type: 'ytd',
            text: 'YTD'
          }, {
            type: 'all',
            text: 'All'
          }],
          selected: 3
        },

        subtitle: {
          text: 'With SMA and Volume by Price technical indicators'
        },

        yAxis: [{
          startOnTick: false,
          endOnTick: false,
          labels: {
            align: 'right',
            x: -3
          },
          title: {
            text: 'OHLC'
          },
          height: '60%',
          lineWidth: 2,
          resize: {
            enabled: true
          }
        }, {
          labels: {
            align: 'right',
            x: -3
          },
          title: {
            text: 'Volume'
          },
          top: '65%',
          height: '35%',
          offset: 0,
          lineWidth: 2
        }],

        tooltip: {
          split: true
        },

        series: [{
          type: 'candlestick',
          name: 'AAPL',
          id: 'aapl',
          zIndex: 2,
          data: parsedData.reverse()
        }, {
          type: 'column',
          name: 'Volume',
          id: 'volume',
          data: parsedData.reverse(),
          yAxis: 1
        }, {
          type: 'vbp',
          linkedTo: 'aapl',
          params: {
            volumeSeriesID: 'volume'
          },
          dataLabels: {
            enabled: false
          },
          zoneLines: {
            enabled: false
          }
        }, {
          type: 'sma',
          linkedTo: 'aapl',
          zIndex: 1,
          marker: {
            enabled: false
          }
        }]

      });
    });
  }

}
