# Angular Highcharts - Stock Chart App
This Single Page Application, built using [Angular](https://github.com/angular/angular-cli) (CLI version 9.1.7), will both visualize stock data for several companies and allow users to display MID and CLOSE stock values for companies when provided with a valid QUANDL url.

[Highcharts/Highstock](https://www.highcharts.com/) libraries are used to generate the charts and [Quandl](https://www.quandl.com/) API's are used as data sources


## Submitting URLs in the Build Chart Component

You can submit any valid QUANDL wiki dataset url to fill the chart with. Some ticker example urls are shown below:

https://www.quandl.com/api/v3/datasets/WIKI/AAPL.json

https://www.quandl.com/api/v3/datasets/WIKI/IBM.json

https://www.quandl.com/api/v3/datasets/WIKI/C.json

https://www.quandl.com/api/v3/datasets/WIKI/AXP.json

https://www.quandl.com/api/v3/datasets/WIKI/CVS.json

https://www.quandl.com/api/v3/datasets/WIKI/GE.json

https://www.quandl.com/api/v3/datasets/WIKI/MSFT.json

## Live Environment

The Web application has been deployed via firebase and is accessible through either of the following links:

https://highcharts-angular.web.app/


MIRROR: https://highcharts-angular.firebaseapp.com/

## Development Server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Further help

If you find any bugs, please create a new issue ticket at:
https://github.com/DavidKim01/Angular-Highcharts/issues
