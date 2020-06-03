import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts'
import HC_stock from 'highcharts/modules/stock';
import HC_export from 'highcharts/modules/exporting';
import HC_data from 'highcharts/modules/data';
import { HttpClient } from '@angular/common/http';
import { interval, Subscription } from 'rxjs';

HC_stock(Highcharts);
HC_export(Highcharts);
HC_data(Highcharts);

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

  // public options: any = {
  //   chart: {
  //     type: 'ohlc',
  //     height: 700
  //   },
  //   title: {
  //     text: 'Sample Scatter Plot'
  //   },
  //   credits: {
  //     enabled: false
  //   },
  //   tooltip: {
  //     formatter: function () {
  //       return 'x: ' + Highcharts.dateFormat('%e %b %y %H:%M:%S', this.x) +
  //         ' y: ' + this.y.toFixed(2);
  //     }
  //   },
  //   xAxis: {
  //     type: 'datetime',
  //     labels: {
  //       formatter: function () {
  //         return Highcharts.dateFormat('%e %b %y', this.value);
  //       }
  //     }
  //   },
  //   series: [
  //     {
  //       name: 'Normal',
  //       turboThreshold: 500000,
  //       data: [[new Date('2018-01-25 18:38:31').getTime(), 2]]
  //     },
  //     {
  //       name: 'Abnormal',
  //       turboThreshold: 500000,
  //       data: [[new Date('2018-02-05 18:38:31').getTime(), 7]]
  //     }
  //   ]
  // }
  // subscription: Subscription;
  // constructor(private http: HttpClient) { }

  ngOnInit(): void {
    //Highcharts.chart('container', this.options);

    // let d : Date = new Date(2018,0o3,27);
    // console.log(d.getUTCMilliseconds());
    // let t: string = "2018-03-27";
    // let dateArray: string[] = t.split('-');

    // let dd: Date = new Date(parseInt(dateArray[0],10),parseInt(dateArray[1],10),parseInt(dateArray[2],10));
    // console.log("ANSWER: " + dd.getTime());
    let apiKey: string = "qPkR3WAyaVxXgh6hFAJi";
    let tickerUrl: string = "https://www.quandl.com/api/v3/datasets/WIKI/";
    let tickerChoice: string = "AAPL";

    Highcharts.getJSON(`${tickerUrl}${tickerChoice}.json?api_key=${apiKey}`, function (data) {
      let parsedData = data.dataset.data.map((entry) => {
        return entry.slice(0,5);
      });
      let d = new Date();
      let n = d.getTime();
      let altered = parsedData.forEach((entry)=>{
        let dateArray: string[] = entry[0].split('-');
        let dd: Date = new Date(parseInt(dateArray[0],10),parseInt(dateArray[1],10)-1,parseInt(dateArray[2],10));
        entry[0] = dd.getTime();
      })
      console.log(parsedData);
      Highcharts.stockChart('container', {

        chart: {
          type: 'ohlc',
          borderColor: "#555555"
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
            count: 6,
            text: '6m'
        }, {
            type: 'all',
            text: 'All'
        }],
          selected: 2
        },

        title: {
          text: 'AAPL Stock Price'
        },

        series: [{
          type: 'ohlc',
          name: 'AAPL Stock Price',
          data: parsedData.reverse(),
          dataGrouping: {
                units: [[
                    'week', // unit name
                    [1] // allowed multiples
                ], [
                    'month',
                    [1, 2, 3, 4, 6]
                ]]
            }
        }]
      })

      Highcharts.getJSON('https://www.highcharts.com/samples/data/aapl-ohlc.json', function (data) {
        console.log(data);

        // // create the chart
        // Highcharts.stockChart('container', {


        //   rangeSelector: {
        //     selected: 2
        //   },

        //   title: {
        //     text: 'AAPL Stock Price'
        //   },

        //   series: [{
        //     type: 'ohlc',
        //     name: 'AAPL Stock Price',
        //     data: data,
        //     dataGrouping: {
        //       units: [[
        //         'week', // unit name
        //         [1] // allowed multiples
        //       ], [
        //         'month',
        //         [1, 2, 3, 4, 6]
        //       ]]
        //     }
        //   }]
        // });
      });
      // // create the chart
      // Highcharts.stockChart('container', {


      //   rangeSelector: {
      //     selected: 2
      //   },

      //   title: {
      //     text: 'AAPL Stock Price'
      //   },

      //   series: [{
      //     type: 'ohlc',
      //     name: 'AAPL Stock Price',
      //     data: data.dataset.data,
      //     dataGrouping: {
      //       units: [[
      //         'week', // unit name
      //         [1] // allowed multiples
      //       ], [
      //         'month',
      //         [1, 2, 3, 4, 6]
      //       ]]
      //     }
      //   }]
      // });
    });
  }

  // Set 10 seconds interval to update data again and again
  //   const source = interval(10000);


  //   // Sample API
  //   const apiLink = 'https://www.quandl.com/api/v3/datasets/WIKI/AAPL.json';

  //   this.subscription = source.subscribe(val => this.getApiResponse(apiLink).then(
  //     (data: any[]) => {
  //       const updated_normal_data = [];
  //       const updated_abnormal_data = [];
  //       data.forEach(row => {
  //         const temp_row = [
  //           new Date(row.timestamp).getTime(),
  //           row.value
  //         ];
  //         row.Normal === 1 ? updated_normal_data.push(temp_row) : updated_abnormal_data.push(temp_row);
  //       });
  //       this.options.series[0]['data'] = updated_normal_data;
  //       this.options.series[1]['data'] = updated_abnormal_data;
  //       Highcharts.stockChart('container', this.options);
  //     },
  //     error => {
  //       console.log('Something went wrong.');
  //     })
  //   );

  // }

  // getApiResponse(url) {
  //   return this.http.get(url, {})
  //     .toPromise().then(res => {
  //       return res;
  //     });
  // }

}
