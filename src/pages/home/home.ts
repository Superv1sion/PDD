import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  themes = [];

  constructor(public navCtrl: NavController, public http: HttpClient) {
    this.loadThemes();
  }

  loadThemes(){
    var themes = [];
    this.http.get<any[]>('assets/data/data-rus.json').subscribe(data => {
      data.forEach(function(element, index) {
        themes.push(element.theme);
      });
    });
    this.themes = themes;
  }
}
