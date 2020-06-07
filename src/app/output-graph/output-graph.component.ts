import { Component, OnInit, OnChanges } from '@angular/core';
import { HttpService } from '../http.service';
import { Subscription, Observable } from 'rxjs';
import { timer } from 'rxjs/observable/timer';

import * as Highcharts from 'highcharts'
import HC_stock from 'highcharts/modules/stock';
import HC_export from 'highcharts/modules/exporting';
import HC_data from 'highcharts/modules/data';
import HC_indicators from 'highcharts/indicators/indicators';
import theme from 'highcharts/themes/dark-unica';

HC_stock(Highcharts);
HC_export(Highcharts);
HC_data(Highcharts);
HC_indicators(Highcharts);
theme(Highcharts);

const apiKey: string = 'qPkR3WAyaVxXgh6hFAJi';
const tickerUrl: string = 'https://www.quandl.com/api/v3/datasets/WIKI/';

@Component({
  selector: 'app-output-graph',
  templateUrl: './output-graph.component.html',
  styleUrls: ['./output-graph.component.css']
})
export class OutputGraphComponent implements OnInit, OnChanges {
  tickers: string[] = ['AAPL', 'IBM', 'C', 'AXP', 'CVS', 'GE', 'MSFT'];
  tickerChoice: string = "";
  isHidden: boolean = true;
  isBlank: boolean = true;
  lastUpdated: string = '';

  firstChart: Highcharts.Chart;
  secondChart: Highcharts.Chart;

  intervalVal: number = 120000;

  subscription: Subscription;
  source: Observable<number> = timer(0, this.intervalVal);

  constructor(private _http: HttpService) { }

  ngOnInit(): void {
    this.firstChart = Highcharts.stockChart('ohlc-chart', {
      series: [{
        type: 'ohlc',
        data: [[0,0]],
        dataGrouping: {
          units: [[
            'day',
            [1]
          ]]
        }
      }
      ]
    });
    this.secondChart = Highcharts.stockChart('candle-chart', {
      series: [{
        type: 'candlestick',
        data: [[0,0]],
        dataGrouping: {
          units: [[
            'day',
            [1]
          ]]
        }
      }
      ]
    });
  }

  ngOnChanges(): void {
    this.parseData(this.tickerChoice);
  }

  parseData(tickerSelected: string): void {
    this.isHidden = false;
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.subscription = this.source.subscribe(val => this._http.getData(`${tickerUrl}${tickerSelected}.json?api_key=${apiKey}`).then(
      function (data: any) {
        let timeStamp: Date = new Date();
        console.log("Performing new GET request at: " + timeStamp.toLocaleTimeString());
        let parsedData: any[] = [];
        let volumes: any[] = [];
        let dataSize: number = data.dataset.data.length;

        let startDate: string = data.dataset.data[dataSize - 1][0];
        let endDate: string = data.dataset.data[0][0];

        let datePulled: Date = new Date();

        let dateArray: string[] = [];
        let dateInMs: number = 0;

        for (let i: number = dataSize - 1; i >= 0; i -= 1) {
          dateArray = data.dataset.data[i][0].split('-');
          datePulled = new Date(parseInt(dateArray[0], 10), parseInt(dateArray[1], 10) - 1, parseInt(dateArray[2], 10));
          dateInMs = datePulled.getTime();

          parsedData.push([
            dateInMs,
            data.dataset.data[i][1],
            data.dataset.data[i][2],
            data.dataset.data[i][3],
            data.dataset.data[i][4]
          ]);

          volumes.push([
            dateInMs,
            data.dataset.data[i][5]
          ]);
        }

        let results: [string, string, string, Date, any[], any[]] = [tickerSelected, startDate, endDate, timeStamp, parsedData, volumes];

        return results;

      },
      error => {
        console.log('Error in getting data...');
      }).then((results) => {
        this.displayCharts(results[0], results[1], results[2], results[3], results[4], results[5]);
        this.isHidden = true;
        this.isBlank = false;
        this.lastUpdated = new Date().toLocaleString();
      })
    );

    // I had initially used the Highcharts.getJSON method to fetch the data but decided to create a subscription instead
    // also although the parsing of data is more consise here I decided to use a simpler method of parsing the data, shown in the get charts method 
    /*
    Highcharts.getJSON(`${this.tickerUrl}${tickerSelected}.json?api_key=${this.apiKey}`, function (data) {
      let parsedData: [][] = data.dataset.data.map((entry) => {
        return entry.slice(0, 5);
      });
      
      let formattedDateData = parsedData.forEach((entry) => {
        let dateArray: string[] = entry[0].split('-');
        let dd: Date = new Date(parseInt(dateArray[0], 10), parseInt(dateArray[1], 10) - 1, parseInt(dateArray[2], 10));
        entry[0] = dd.getTime();
      })
      console.log(parsedData);


    });
    */

  }

  displayCharts(tickerSelected: string, startDate: string, endDate: string, timeStamp: Date, parsedData: any[], volumes: any[]): void {
    if (this.isBlank) {
      console.log("Populating chart data for the first time...");
      this.firstChart = Highcharts.stockChart('ohlc-chart', {

        title: {
          text: `OHLC Chart (Open-High-Low-Close) for ${tickerSelected}`
        },

        subtitle: {
          text: `From ${startDate} to ${endDate}, last updated on ${timeStamp}`
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
          name: `${tickerSelected} Stock Price`,
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
      });

      this.secondChart = Highcharts.stockChart('candle-chart', {

        title: {
          text: `Candlestick Chart for ${tickerSelected} with Volumes in Lower Pane`
        },

        subtitle: {
          text: `From ${startDate} to ${endDate}, last updated on ${timeStamp}`
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
          name: `${tickerSelected} Stock Price`,
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

    }
    else {
      console.log("Updating data...");
      this.firstChart.update({
        title: {
          text: `OHLC Chart (Open-High-Low-Close) for ${tickerSelected}`
        },

        subtitle: {
          text: `From ${startDate} to ${endDate}, last updated on ${timeStamp}`
        },
        series: [{
          type: 'ohlc',
          id: 'first',
          name: `${tickerSelected} Stock Price`,
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

      }, true, false);
      this.secondChart.update({
        title: {
          text: `Candlestick Chart for ${tickerSelected} with Volumes in Lower Pane`
        },

        subtitle: {
          text: `From ${startDate} to ${endDate}, last updated on ${timeStamp}`
        },
        series: [{
          type: 'candlestick',
          name: `${tickerSelected} Stock Price`,
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

      }, true, false);
    }
  }

}
