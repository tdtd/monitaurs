import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routing from './main.routes';
//let Highcharts = require('highcharts/highstock');
export class MainController {
  chart = {
    options: {
      chart: {
        backgroundColor: 'transparent',
        navigator: { enabled: true },
        rangeSelector: {
          enabled: false
        },
      },
      plotOptions: {
        series: {
          lineWidth: 1,
          fillOpacity: 0.5
        },
        column: {
          stacking: 'normal'
        },
        area: {
          stacking: 'normal',
          marker: {
            enabled: false
          }
        }
      },
      xAxis: [{
        type: 'datetime'
      }],
      yAxis: [
        { // Primary yAxis
          
          min: 0,
          allowDecimals: false,
          title: {
            text: '',
            style: {
              color: '#80a3ca'
            }
          },
          labels: {
            format: '{value}',
            style: {
              color: '#80a3ca'
            }
          }
        }],
    },
    useHighStocks: true,
    title : {
      text : ''
    },
    rangeSelector : {
      selected : 1
    },
    series: []
  };
  
  /*@ngInject*/
  constructor($http, $scope, socket) {
    this.$http = $http;
    this.$scope = $scope;
    this.socket = socket;

    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('sharedstocks');
    });
  }

  $onInit() {
    this.getStockSymbols();
  }

  addStock(stockSymbol) {
    if(stockSymbol) {
      this.$http.post('/api/sharedstocks', {
        name: stockSymbol
      })
      .catch(err => {
        if (err.status == 404){
          //Mark stock symbol not found
        }
      });
      this.newStock = '';
    }
  }

  deleteStock(stockSymbol) {
    this.removeStock(stockSymbol.name);
    this.$http.delete(`/api/sharedstocks/${stockSymbol._id}`);
  }
  
  removeStock(name){
    let self = this;
    this.chart.series.forEach((stk, i) => {
      if (stk.name.toLowerCase() == name.toLowerCase()) {
        self.chart.series.splice(i, 1);
      }
    })
  }

  getStockSymbols() {
    this.stockInfo = [];
    let self = this;
    this.$http.get('/api/sharedstocks/')
      .then(response => {
        self.stockSymbols = response.data;
        self.getStocksInfo(self.stockSymbols)
        self.socket.syncUpdates('sharedStock', self.stockSymbols, (event, stock) => {
          if(event == 'created'){
            self.getStocksInfo([stock])
          } else {
            self.removeStock(stock.name)
          }
        });
    });
  }

  getStocksInfo(stockArray){
    let self = this;
    let arr = stockArray.map(stk => {return stk.name});
    this.$http.get('api/sharedstocks/info/?stocks='+arr)
      .then(res => {
        for(let i = 0, len = stockArray.length; i < len; i++){
          if (stockArray[i].name in res.data){
            res.data[stockArray[i].name]._id = stockArray[i]._id;
          }
        }
        self.updateChart(res.data)
      })
      .catch(err => {
        
      })
  }

  updateChart(dataArr){
    let self = this;
    Object.keys(dataArr).forEach(key => {
      let closeData = dataArr[key].map((info) => {
        return [new Date(info.date).getTime(), info.close];
      })
      this.chart.series.push({name: key.toUpperCase(), data:closeData, _id:dataArr[key]._id, color: self.getRandomColor(dataArr[key]._id)})
    });
  }

  getRandomColor(id) {
    if(!id){ return }
    let letters = '0123456789ABCDEF'.split('');
    let color = '#';
    let regA = /@/g;
    let regB = /!/g;
    
    id = id.replace(regA, 'A');
    id = id.replace(regB, 'I');
    id = id.substr(id.length-6, 6);
    for (let i = 0; i < 6; i++ ) {
      color += letters[Math.floor(this.random(id[i]) * 16)];
    }
    return color;
  }

  random(seed) {
    let n = parseInt(seed,36)
    let x = Math.sin(n++) * 10000;
    return x - Math.floor(x);
  }
}

export default angular.module('monitaurApp.main', [uiRouter])
  .config(routing)
  .component('main', {
    template: require('./main.html'),
    controller: MainController
  })
  .name;
