import { Component } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';

@Component({
  selector: 'page-work',
  templateUrl: 'work.html'
})
export class WorkPage {

  data = [];
  dataFiled = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public events: Events) {
    events.subscribe('theme:start:solve', (theme) => {
      this.data = theme;
      this.dataFiled = true; 
      console.log(this.data);
    });
  }
}
