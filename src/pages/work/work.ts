import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Slides, Events } from 'ionic-angular';

@Component({
  selector: 'page-work',
  templateUrl: 'work.html'
})
export class WorkPage { 
  @ViewChild(Slides) slider: Slides;
  
  testEnded = false;
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
      this.testEnded = false;
      if(this.slider) this.slider.slideTo(0);
    });
  }

  choseTask(){
    this.events.publish('chose:task');
  }

  choseQuestion(index, callEnd = true){
    if(this.data.question[index]) {
      this.slider.slideTo(index);
      this.currentQuestion = this.data.question[index];
    }
    if(!this.data.question.some(e => e.answer_index === -1) && callEnd){
      this.testEnded = true;
    }
  }

  answerQuestion(index, nextQuestionIndex){
    if(this.currentQuestion.answer_index==-1){
      this.currentQuestion.answer_index = index;
      this.currentQuestion.answer_index = index;
      this.choseQuestion(nextQuestionIndex);
    }
  }

  rightAnswersCount(){
    return this.data.question.filter(
        e => e.answer[e.answer_index.toString()].correct
      ).length;
  }

  swipeEvent(e, currentQuestionIndex) {
    switch (e.direction){
      case 2: this.choseQuestion(currentQuestionIndex+1, false); break;
      case 4: this.choseQuestion(currentQuestionIndex-1, false); break;
      default: break;
    }
  }
}
