import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, public http: HttpClient) {
    this.http.get<any[]>('assets/data/data-rus.json').subscribe(data => {
      var themes = document.getElementById("themes");
      data.forEach(function(element, index) {
        var li = document.createElement("li");
        li.innerHTML = "<a href=\"#"+index+"\">"+ element.theme +"</a>";
        themes.appendChild(li);
      });
    });
  }
}
