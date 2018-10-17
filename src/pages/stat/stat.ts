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

  data: {
    main: Array<Object>
    random: Array<Object>
  };

  constructor(public navCtrl: NavController, private storage: Storage) {
    
  }

  loadStorage(){
    return new Promise(() => {
      this.storage.get('random_storage').then((data) => {
        var a = JSON.parse(data);
        this.data.random = a;
      });
      this.storage.get('main_storage').then((data) => {
        var a = JSON.parse(data);
        this.data.main = a;
      });
    })
  }

  createGraph(X, Y1, Y2){
    this.graph = new Chart(this.stat.nativeElement,
      {
        type: 'line',
        data: {
          labels: X,
          datasets: [{
            label: 'Для случайных билетов',
            data: Y1,
            borderColor: 'rgba(54, 162, 235, 1)',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            fill: false,
            lineTension: 0
          },{
            label: 'Для вопросов по темам',
            data: Y2,
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
              display: true,
              scaleLabel: {
                display: true,
                labelString: 'Дата'
              }
            }],
            yAxes: [{
              ticks: {
                beginAtZero:true
              },
              display: true,
              scaleLabel: {
                display: true,
                labelString: 'Правильных ответов'
              }
            }]
          }
        }
    });
  }

  ionViewDidLoad() {
    //this.loadStorage().then(() => {
    //  console.log(this.data);
    //  this.createGraph([],[],[]);
    //});
  }
}
