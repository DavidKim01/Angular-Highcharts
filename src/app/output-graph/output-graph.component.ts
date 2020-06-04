import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts'
import HC_stock from 'highcharts/modules/stock';
import HC_export from 'highcharts/modules/exporting';
import HC_data from 'highcharts/modules/data';
import HC_drag from 'highcharts/modules/drag-panes';
import HC_indicators from 'highcharts/indicators/indicators';

import { HttpClient } from '@angular/common/http';
import { interval, Subscription } from 'rxjs';
import { tick } from '@angular/core/testing';

HC_stock(Highcharts);
HC_export(Highcharts);
HC_data(Highcharts);
HC_indicators(Highcharts);
HC_drag(Highcharts);

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
      // let parsedData: [][] = data.dataset.data.map((entry) => {
      //   return entry.slice(0, 5);
      // });

      let parsedData: any[] = [];
      let volumes: any[] = [];
      let dataSize: number = data.dataset.data.length;

      let startDate: string = data.dataset.data[dataSize-1][0];
      let endDate: string = data.dataset.data[0][0];

      let datePulled: Date = new Date();
      let dateArray: string[] = [];
      let dateInMs: number = 0;

      for (let i: number = dataSize - 1; i >= 0; i -= 1) {
        dateArray = data.dataset.data[i][0].split('-');
        datePulled = new Date(parseInt(dateArray[0], 10), parseInt(dateArray[1], 10) - 1, parseInt(dateArray[2], 10));
        dateInMs = datePulled.getTime();
        parsedData.push([
          dateInMs, // the date
          data.dataset.data[i][1], // open
          data.dataset.data[i][2], // high
          data.dataset.data[i][3], // low
          data.dataset.data[i][4] // close
        ]);

        volumes.push([
          dateInMs, // the date
          data.dataset.data[i][5] // the volume
        ]);
      }

      // let formattedDateData = parsedData.forEach((entry) => {
      //   let dateArray: string[] = entry[0].split('-');
      //   let dd: Date = new Date(parseInt(dateArray[0], 10), parseInt(dateArray[1], 10) - 1, parseInt(dateArray[2], 10));
      //   entry[0] = dd.getTime();
      // })
      // console.log(parsedData);

      Highcharts.stockChart('ohlc-chart', {

        title: {
          text: `OHLC Chart (Open-High-Low-Close) for ${tickerChoice}`
        },

        subtitle: {
          text: `from ${startDate} to ${endDate}`
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

        tooltip: {
          split: true
        },

        series: [{
          type: 'ohlc',
          id: 'first',
          name: `${tickerChoice} Stock Price`,
          data: parsedData,
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
          linkedTo: 'first',
          color: 'green',
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
          linkedTo: 'first',
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

      Highcharts.stockChart('candle-chart', {

        title: {
          text: `Candlestick Chart for ${tickerChoice} with Volumes in Lower Pane`
        },

        subtitle: {
          text: `from ${startDate} to ${endDate}`
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

        yAxis: [{
          startOnTick: false,
          endOnTick: false,
          labels: {
            align: 'right',
            x: -3
          },
          title: {
            text: 'Candle'
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
          name: `${tickerChoice} Stock Price`,
          id: 'second',
          data: parsedData,
          dataGrouping: {
            units: [[
              'day',
              [1]
            ]]
          }
        }, {
          type: 'column',
          name: 'Volume',
          id: 'volume',
          data: volumes,
          dataGrouping: {
            units: [[
              'day',
              [1]
            ]]
          },
          yAxis: 1
        }, {
          type: 'sma',
          name: 'Smart Moving Average 25-day',
          linkedTo: 'second',
          color: 'blue',
          dataGrouping: {
            approximation: 'averages',
            groupPixelWidth: 25,
            units: [[
              'day',
              [25]
            ]]
          }
        }, {
          type: 'sma',
          name: 'Smart Moving Average 200-day',
          linkedTo: 'second',
          color: 'orange',
          dataGrouping: {
            approximation: 'averages',
            groupPixelWidth: 200,
            units: [[
              'day',
              [200]
            ]]
          }
        }]

      });
    });
  }

}
