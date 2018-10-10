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
}
