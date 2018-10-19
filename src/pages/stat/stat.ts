import { Component, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Chart } from 'chart.js';
import * as $ from 'jquery';

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
  isPie = false;

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
    if(this.graph!=null) this.graph.destroy();
    this.graph = new Chart(this.stat.nativeElement,
      {
        type: 'bar',
        data: {
          labels: arr.X,
          datasets: [{
            label: 'В среднем',
            data: arr.Y3,
            borderColor: 'rgba(30, 144, 255, 1)',
            backgroundColor: 'rgba(30, 144, 255, 0.8)',
            fill: false,
						pointRadius: 3,
						pointHoverRadius: 6,
            cubicInterpolationMode: 'monotone',
            type: 'line'
          },{
            label: 'Случайные вопросы',
            data: arr.Y1,
            borderColor: 'rgba(50, 160, 50, 1)',
            backgroundColor: 'rgba(50, 160, 50, 0.8)',
            fill: false,
						pointRadius: 3,
						pointHoverRadius: 6,
            cubicInterpolationMode: 'monotone'
          },{
            label: 'Вопросы по темам',
            data: arr.Y2,
            borderColor: 'rgba(255, 206, 86, 1)',
            backgroundColor: 'rgba(255, 206, 86, 0.8)',
            fill: false,
						pointRadius: 3,
						pointHoverRadius: 6,
            cubicInterpolationMode: 'monotone'
          }]
        },
        options: {
          maintainAspectRatio: false,
          scales: {
            xAxes: [{
              ticks: {
                beginAtZero:true
              },
              display: true,
              gridLines: {
                color: "rgba(0, 0, 0, 0.7)"
              }
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
          },
          tooltips: {
            mode: 'index',
            axis: 'y'
          }
        }
    });
  }

  createPie(){
    var totalRight = this.main.right + this.random.right;
    var totalWrong = this.main.all + this.random.all - totalRight;

    if(this.graph!=null) this.graph.destroy();

    this.graph = new Chart(this.stat.nativeElement,
      {
        type: 'pie',
        data: {
          labels: ['Правильных ответов', 'Неправильных ответов', 'Всего ответов'],
          datasets: [{
            data: [totalRight, totalWrong, null],
            backgroundColor: ['rgba(50, 160, 50, 1)', 'rgba(255, 61, 103, 1)', 'rgba(255, 205, 86, 1)'],
            borderColor: ['rgba(50, 160, 50, 0.8)', 'rgba(255, 61, 103, 0.8)', 'rgba(255, 205, 86, 0)'],
          },{
            data: [null, null, totalRight + totalWrong],
            backgroundColor: ['rgba(50, 160, 50, 1)', 'rgba(255, 61, 103, 1)', 'rgba(255, 205, 86, 1)'],
            borderColor: ['rgba(50, 160, 50, 0.8)', 'rgba(255, 61, 103, 0.8)', 'rgba(255, 205, 86, 0)'],
          }]
        },
        options: {
          maintainAspectRatio: false,
        }
    });
  }

  switchStat(alltime){
    if(alltime) this.allTimeStat = true;
    else this.allTimeStat = false;

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
    var arrays = this.buildGraphArrays();

    if(!this.isPie) this.createGraph(arrays);
    else this.createPie();
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
    var arr = {X: [], Y1: [], Y2: [], Y3: []};
    if(this.data.random && this.data.random.filter((e) => this.sevenDaysFilter(e.day)))
      this.data.random.filter((e) => this.sevenDaysFilter(e.day)).forEach((e, i) => {
        arr.X.push(e.day);
        arr.Y1.push(parseFloat((e.right/e.all*100).toFixed(2)));
        arr.Y2.push(null);
        arr.Y3.push(parseFloat((e.right/e.all*100).toFixed(2)));
      });
    if(this.data.main && this.data.main.filter((e) => this.sevenDaysFilter(e.day)))
      this.data.main.filter((e) => this.sevenDaysFilter(e.day)).forEach((e, i) => {
        if(arr.X.includes(e.day)){
          var index = arr.X.indexOf(e.day);
          arr.Y2[index] = parseFloat((e.right/e.all*100).toFixed(2));
          var el = this.data.random.filter((el) => el.day == e.day)[0];
          arr.Y3[index] = parseFloat(((e.right+el.right)/(e.all+el.all)*100).toFixed(2));
        }
        else {
          for(var j=0; j < arr.X.length; j++) if(this.dateDifference(arr.X[j], e.day) > 0) break;
          arr.X.splice(j,0,e.day);
          arr.Y1.splice(j,0,null);
          arr.Y2.splice(j,0,parseFloat((e.right/e.all*100).toFixed(2)));
          arr.Y3.splice(j,0,parseFloat((e.right/e.all*100).toFixed(2)));
        }
      });
    if(arr.Y3.length>1){
      this.gain = parseFloat((arr.Y3[arr.Y3.length-1] - arr.Y3[arr.Y3.length-2]).toFixed(2));
    } else if(arr.Y3.length==1){
      this.gain = parseFloat((arr.Y3[arr.Y3.length-1]).toFixed(2));
    } else if(arr.Y3.length==0){
     this.gain == 0;
    }
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
    if(now.valueOf()-date.valueOf() > 24*60*60*1000*6) return false;
    else return true;
  }

  ionViewWillEnter() {
    this.loadStorage().then(() => {
      this.switchStat(false);
    });
  }
}
