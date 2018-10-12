import { Component } from '@angular/core';
import { NavController, Events } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  data = [];

  constructor(public navCtrl: NavController, public http: HttpClient, public events: Events) {
    this.loadThemes();
  }

  loadThemes(){
    this.http.get<any[]>('assets/data/data-rus.json').subscribe(data => {
      this.data = data;
    });
  }

  startTasks(theme){
    this.events.publish('theme:chosen', theme);
  }

  startRandomTasks(){
    var theme = {
      theme: "Случайный билет с вопросами",
      question: []
    };
    var history = [];

    while(theme.question.length!=20) {
      var first = Math.floor(Math.random()*(this.data.length));
      var second = Math.floor(Math.random()*(this.data[first].question.length));
      if (!history.some(e => e.first === first && e.second === second)) {
        history.push({ 'first': first, 'second': second});
        theme.question.push(this.data[first].question[second]);
      }
    }
    this.events.publish('theme:chosen', theme);
  }
}
