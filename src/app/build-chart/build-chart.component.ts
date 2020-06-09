import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl, Validators } from '@angular/forms'

import { HttpService } from '../http.service';

import * as Highcharts from 'highcharts'
import HC_stock from 'highcharts/modules/stock';
import HC_exporting from 'highcharts/modules/exporting';
import HC_export from 'highcharts/modules/export-data';
import HC_data from 'highcharts/modules/data';
import HC_indicators from 'highcharts/indicators/indicators';
import HC_nodata from 'highcharts/modules/no-data-to-display'

import theme from 'highcharts/themes/dark-unica';

HC_stock(Highcharts);
HC_exporting(Highcharts);
HC_export(Highcharts);
HC_data(Highcharts);
HC_indicators(Highcharts);
HC_nodata(Highcharts);
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
  myChart: Highcharts.Chart;
  initialOptions: Object;
  tickersLength: number;
  tickersCount: number = 0;
  cache: Object = {};

  constructor(private fb: FormBuilder, private _http: HttpService) { }

  ngOnInit() {

    this.myForm = this.fb.group({
      seriesType: ['',[
        Validators.required
      ]],
      urls: this.fb.array([])
    });
    this.initializeChart();
    
    
    //setTimeout(()=>{this.myChart.showLoading('LOADING...');},3000)
  }

  initializeChart(){
    this.initialOptions = {
      legend: {
        enabled: true,
        verticalAlign: 'top'
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
      title: {
        text: 'Custom Point Markers Only Chart'
      },
      lang: {
        noData: "NO DATA ENTERED. PLEASE FILL OPTIONS BELOW."
      },
      noData: {
        style: {
            fontSize: '2em',
            color: '#E0E0E3',
            backgroundColor: '#E0E0E3'
        }
      },
      loading: {
        hideDuration: 200,
        showDuration: 300,
        style: {
          opacity: 1
        }
      },
      navigator: {
        enabled: false
      }

      
    };
    this.myChart = Highcharts.stockChart('chart', this.initialOptions);
  }

  get urlForms() {
    return this.myForm.get('urls') as FormArray;
    
  }
  get urlsArray(){
    let urlsArr = [];
    this.urlForms.value.forEach(element => {urlsArr.push(element.url)})
    return urlsArr;
  }
  get seriesType() {
    return this.myForm.get('seriesType');
  }

  validateUrls(): boolean {
    let isWrong: boolean = false;

    this.urlForms.value.forEach(element => {
      if(element.url.length < 1 || !element.url.startsWith("https://www.quandl.com/api/v3/datasets/WIKI/")){
        isWrong=true;
      }
    });
    return isWrong;
  }

  resetForms() {
    this.myForm = this.fb.group({
      seriesType: ['',[
        Validators.required
      ]],
      urls: this.fb.array([])
    });
    this.tickersCount = 0;
  }

  addUrl() {
    const url = this.fb.group({ 
      url: ''
    });

    this.urlForms.push(url);
    let num = [];
  }

  deleteUrl(i) {
    this.urlForms.removeAt(i);
  }

  submitHandler() {
    this.myChart.update({
      navigator:{
        enabled: true
      }
    });
    this.myChart.showLoading('LOADING...');
    let urls = this.urlsArray;
    let type = this.seriesType.value;
    let tickersList: string[] = urls.map(e=>{return e.substring(44, e.length-5)});
    this.tickersLength = tickersList.length;

    let filteredTickersList = tickersList.filter((ticker, index)=>{
      return tickersList.indexOf(ticker) === index;
    })
    
    this.checkData(filteredTickersList, type);
  }

  checkData(tickersList: string[], type: string){
    console.log(`Tickers selected: ${tickersList}`);
    
    tickersList.forEach(ticker=>{
      //if ticker data is already in cache
      let cacheName = `${ticker}-${type}`;
      if (this.cache.hasOwnProperty(cacheName)){
        this.tickersCount += 1;
        console.log(`${cacheName} data exists in cache! No REST call needed.`);
        this.updateCharts(this.cache[cacheName], type, ticker);
        if (this.tickersCount >= this.tickersLength){
          this.myChart.hideLoading();
        }
      }
      else {
        this.myChart.showLoading();
        console.log(`Performing GET request for TICKER: ${ticker}`);
        this._http.getData(`${tickerUrl}${ticker}.json?api_key=${apiKey}`).then((data:any)=>{
          
          //parse data
          let parsedMidData: any[] = [];
          let parsedCloseData: any[] = [];
          let dataSize: number = data.dataset.data.length;

          let datePulled: Date = new Date();
          let dateArray: string[] = [];
          let dateInMs: number = 0;
          
          for (let i: number = dataSize - 1; i >= 0; i -= 1){
            dateArray = data.dataset.data[i][0].split('-');
            datePulled = new Date(parseInt(dateArray[0], 10), parseInt(dateArray[1], 10) - 1, parseInt(dateArray[2], 10));
            dateInMs = datePulled.getTime();

            if(type==="MID"){
              parsedMidData.push([
                dateInMs, //date
                (data.dataset.data[i][2]+data.dataset.data[i][2])/2 //Mid = (High + Low) / 2
              ]);

            }

            else {
              parsedCloseData.push([
                dateInMs, //date
                data.dataset.data[i][1] //close
              ]);
            }
            
          }

          //update charts with parsed mid or close data
          if(type==="MID"){
            this.updateCharts(parsedMidData, type, ticker);
            let results: [string, string, any[]] = [ticker, type, parsedMidData];
            return results;
          }
          else {
            this.updateCharts(parsedCloseData, type, ticker);
            let results: [string, string, any[]] = [ticker, type, parsedCloseData];
            return results;
          }
          
        }).then(results=>{
          let cacheName = `${results[0]}-${results[1]}`;
          this.cache[cacheName] = results[2];
          this.tickersCount += 1;
        }).finally(()=>{
          if (this.tickersCount >= this.tickersLength){
            this.myChart.hideLoading();
            console.log("FINISHED ALL GET REQUESTS")
          }
        });
        
      }
      
    });
    
  }

  updateCharts(parsedData: any[], type: string, ticker: string) {
    let newSeries: Highcharts.SeriesOptionsType = {
      name: `${ticker} ${type}`,
      type: "line",
      data: parsedData,
      lineWidth: 0,
      marker: {
        enabled: true,
        radius: 2
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
    
    this.myChart.addSeries(newSeries, true);
  }

  clearCache(){
    this.cache = {};
  }
}
