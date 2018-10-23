import { Component } from '@angular/core';
import { NavController, Events } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  searchString = '';
  openSearch = false;
  data: any[];
  loc: any;
  localization: string;

  constructor(public navCtrl: NavController, public http: HttpClient, public events: Events, private storage: Storage) {
    this.loc = [];
    this.data = [];
    this.events.subscribe('next:task:generate', ()=>{
      this.startRandomTasks();
    });
  }

  ionViewWillEnter(){
    this.storage.get('localization').then(data => {
      if(data!==null) this.localization = data;
      else this.localization = "ru";
      this.Translate();
    });
  }

  Translate(){
    this.http.get<any[]>('assets/data/data-'+this.localization+'.json').subscribe(data => {
      this.data = data;
    });
    this.http.get<any>('assets/data/localization-'+this.localization+'.json').subscribe(data => {
      this.loc = data.home;
    });
    this.storage.set('localization', this.localization);
  }

  setSearchString(val){
    if (val && val.trim() !== '') this.searchString = val;
    else this.searchString = '';
  }

  searchContainTheme(theme){
    if(theme.toLowerCase().includes(this.searchString.toLowerCase()) || this.searchString === '') return true;
    else return false;
  }

  startTasks(theme, index){
    this.events.publish('theme:chosen', theme, index);
  }

  startRandomTasks(){
    var theme = {
      theme: this.loc.random,
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
    this.events.publish('theme:chosen', theme, history);
  }
}
