import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Slides, Events, Loading } from 'ionic-angular';
import { Slides } from 'ionic-angular';

@Component({
  selector: 'page-work',
  templateUrl: 'work.html'
})
export class WorkPage {
  @ViewChild(Slides) slides: Slides;

  data = [];
  dataFiled = false;
  currentQuestion = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public events: Events) {
    events.subscribe('theme:start:solve', (theme) => {
      this.data = [];
      this.data = theme;
      this.currentQuestion = theme.question[0];
      this.dataFiled = true;
    });
  }

  choseTask(){
    this.events.publish('chose:task');
  }

  choseQuestion(index){
    if(this.data.question) {
      this.slides.slideTo(index);
      this.currentQuestion = [];
      this.currentQuestion = this.data.question[index];
    }
  }

  answerQuestion(answer){
    //TODO: set style of buttons if answer is correct;
    console.log(answer.correct);
    if(!this.slides.isEnd()){
      this.choseQuestion(this.slides.getActiveIndex()+1);
    }
  }
}
