import { Component, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Chart } from 'chart.js';

@Component({
  selector: 'page-stat',
  templateUrl: 'stat.html'
})
export class StatPage {
  @ViewChild('stat') stat;
  graph: any;
  main = {right: 0, all: 0};
  random = {right: 0, all: 0};
  ratio = 0;
  gain = 0;
  allTimeStat = false;

  data: {
    random: Array<any>
    main: Array<any>
  }

  constructor(public navCtrl: NavController, private storage: Storage) {
    
  }

  loadStorage(){
    return new Promise((resolve, reject) => {
      var d = {main: [], random: []};
      this.storage.get('random_storage').then((data) => {
        var a = JSON.parse(data);
        d.random = a;
        this.storage.get('main_storage').then((data) => {
          var a = JSON.parse(data);
          d.main = a;
          this.data = d;
          resolve();
        });
      });
    })
  }

  createGraph(arr){
    this.graph = new Chart(this.stat.nativeElement,
      {
        type: 'line',
        data: {
          labels: arr.X,
          datasets: [{
            label: 'Случайные вопросы',
            data: arr.Y1,
            borderColor: 'rgba(34, 139, 34, 1)',
            backgroundColor: 'rgba(34, 139, 34, 0.2)',
            fill: false,
            lineTension: 0
          },{
            label: 'Вопросы по темам',
            data: arr.Y2,
            borderColor: 'rgba(255, 206, 86, 1)',
            backgroundColor: 'rgba(255, 206, 86, 0.2)',
            fill: false,
            lineTension: 0
          }]
        },
        options: {
          scales: {
            xAxes: [{
              ticks: {
                beginAtZero:true
              },
              display: true
            }],
            yAxes: [{
              ticks: {
                beginAtZero:true
              },
              display: true,
              scaleLabel: {
                display: true,
                labelString: 'Правильных ответов, %'
              }
            }]
          }
        }
    });
  }

  switchStat(alltime){
    switch(alltime){
      case true: this.allTimeStat = true; break;
      case false: this.allTimeStat = false; break;
    }
    this.clearStat();
    if(this.data.main && this.data.main.filter((e) => this.sevenDaysFilter(e.day))) this.data.main.filter((e) => this.sevenDaysFilter(e.day)).forEach((e) => {
      this.main.all += e.all;
      this.main.right += e.right;
    });    
    if(this.data.random && this.data.random.filter((e) => this.sevenDaysFilter(e.day))) this.data.random.filter((e) => this.sevenDaysFilter(e.day)).forEach((e, i) => {
      this.random.all += e.all;
      this.random.right += e.right;
    });
    var ratio = ((this.main.right + this.random.right)/(this.main.all + this.random.all)*100).toFixed(2);
    this.ratio = parseFloat(ratio);
    //TODO: calculate gain
    this.createGraph(this.buildGraphArrays());
  }

  clearStat(){    
    this.main.all = 0;
    this.main.right = 0;
    this.random.all = 0;
    this.random.right = 0;
    this.ratio = 0;
    this.gain = 0;
  }

  buildGraphArrays(){
    var arr = {X: ['...'], Y1: [0], Y2: [0]};
    if(this.data.random && this.data.random.filter((e) => this.sevenDaysFilter(e.day))) this.data.random.filter((e) => this.sevenDaysFilter(e.day)).forEach((e, i) => {
      arr.X.push(e.day);
      arr.Y1.push(parseFloat((e.right/e.all*100).toFixed(2)));
      arr.Y2.push(0);
    });
    if(this.data.main && this.data.main.filter((e) => this.sevenDaysFilter(e.day))) this.data.main.filter((e) => this.sevenDaysFilter(e.day)).forEach((e, i) => {
      if(arr.X.includes(e.day)){
        var index = arr.X.indexOf(e.day);
        arr.Y2[index] = parseFloat((e.right/e.all*100).toFixed(2));
      }
      else {
        for(var j=0; j < arr.X.length; j++) if(this.dateDifference(arr.X[j], e.day) > 0) break;
        arr.X.splice(j,0,e.day);
        arr.Y1.splice(j,0,0);
        arr.Y2.splice(j,0,parseFloat((e.right/e.all*100).toFixed(2)));
      }
    });
    return arr;
  }

  dateDifference(first, second){
    var f = first.split('.');
    var s = second.split('.');
    var d1 = new Date(f[2], f[1], f[0]);
    var d2 = new Date(s[2], s[1], s[0]);
    return d1.valueOf() - d2.valueOf();
  }

  sevenDaysFilter(day){
    if(this.allTimeStat) return true;
    var now = new Date();
    var d = day.split('.');
    var date = new Date(d[2], d[1], d[0]);
    if(now.valueOf()-date.valueOf() > 24*60*60*1000*7) return false;
    else return true;
  }

  ionViewWillEnter() {
    this.loadStorage().then(() => {
      this.switchStat(false);
    });
  }
}
