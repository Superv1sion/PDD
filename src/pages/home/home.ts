import { Component } from '@angular/core';
import { NavController, Events } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  searchString = '';
  openSearch = false;
  data = [];

  constructor(public navCtrl: NavController, public http: HttpClient, public events: Events) {
    this.loadThemes();
  }

  loadThemes(){
    this.http.get<any[]>('assets/data/data-rus.json').subscribe(data => {
      this.data = data;
    });
  }

  setSearchString(val){
    if (val && val.trim() !== '') this.searchString = val;
    else this.searchString = '';
  }

  searchContainTheme(theme){
    if(theme.toLowerCase().includes(this.searchString.toLowerCase()) || this.searchString === '') return true;
    else return false;
  }

  startTasks(theme){
    this.events.publish('theme:chosen', theme);
  }

  startRandomTasks(){
    var theme = {
      theme: "Случайный билет с вопросами",
      is_random: true,
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
