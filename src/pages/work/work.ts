import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Slides, Events } from 'ionic-angular';

@Component({
  selector: 'page-work',
  templateUrl: 'work.html'
})
export class WorkPage {
  @ViewChild(Slides) slider: Slides;
  
  dataFiled = false;
  data: {
    theme: string
    question: Array<{
      text: string
      image: string
      index: Number
      answer_index: Number
      answer: Array<{
        text: string
        correct: boolean
      }>
    }>
  };
  currentQuestion: {
    text: string
    image: string
    index: Number
    answer_index: Number
    answer: Array<{
      text: string
      correct: boolean
    }>
  };

  constructor(public navCtrl: NavController, public navParams: NavParams, public events: Events) {
    events.subscribe('theme:start:solve', (theme) => {
      this.data = theme;
      this.data.question.forEach((element, index) => {
        element.answer_index = -1;
        element.index = index;
      });
      this.currentQuestion = theme.question[0];
      this.dataFiled = true;
      if(this.slider) this.slider.slideTo(0);
    });
  }

  choseTask(){
    this.events.publish('chose:task');
  }

  choseQuestion(index){
    if(this.data.question[index]) {
      this.slider.slideTo(index);
      this.currentQuestion = this.data.question[index];
    }
  }

  answerQuestion(index, nextQuestionIndex){
    if(this.currentQuestion.answer_index==-1){
      this.currentQuestion.answer_index = index;
      this.currentQuestion.answer_index = index;
      var i = this.currentQuestion.answer_index.toString();
      this.choseQuestion(nextQuestionIndex);
    }
  }

  swipeEvent(e, currentQuestionIndex) {
      switch (e.direction){
        case 2: this.choseQuestion(currentQuestionIndex+1); break;
        case 4: this.choseQuestion(currentQuestionIndex-1); break;
        default: break;
      }
  }
}
