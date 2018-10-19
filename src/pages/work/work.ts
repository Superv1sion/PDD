import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Slides, Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-work',
  templateUrl: 'work.html'
})
export class WorkPage {
  @ViewChild(Slides) slider: Slides;

  testEnded = false;
  dataFiled = false;
  isRandom = false;

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

  constructor(public navCtrl: NavController, public navParams: NavParams, public events: Events, private storage: Storage) {
    events.subscribe('theme:start:solve', (theme) => {
      this.data = theme;
      this.data.question.forEach((element, index) => {
        element.answer_index = -1;
        element.index = index;
      });
      this.currentQuestion = this.data.question[0];
      if(theme.is_random) this.isRandom = true;
      this.dataFiled = true;
      this.testEnded = false;
      if(this.slider) this.slider.slideTo(0);
    });
  }

  choseTask(){
    this.events.publish('chose:task');
    this.testEnded = false;
    this.dataFiled = false;
  }

  choseQuestion(index, callEnd = false){
    if(this.data.question[index]) {
      this.slider.slideTo(index);
      this.currentQuestion = this.data.question[index];
    }
    if(!this.data.question.some(e => e.answer_index === -1) && callEnd){
      this.testEnded = true;
    }
  }

  getCurrentDate(){
    var date = new Date();
    var dd = date.getDate();
    var mm = date.getMonth()+1;
    var yyyy = date.getFullYear();
    return dd + "." + mm + "." + yyyy;
  }

  storeData(correct){
    var key;
    var rightSum;
    if (this.isRandom) key = 'random_storage';
    else key = 'main_storage';
    if (correct) rightSum = 1;
    else rightSum = 0;

    this.storage.get(key).then((data) => {
      if(data!==null) {
        var storage = JSON.parse(data);
        var today = storage.filter(e => e.day === this.getCurrentDate());
        if(today.length>0){
          today[0].right += rightSum;
          today[0].all += 1;
        }
        else storage.push({"day": this.getCurrentDate(), "right": rightSum, "all": 1});
        this.storage.set(key, JSON.stringify(storage));
      }
      else this.storage.set(key, '[{"day": "'+this.getCurrentDate()+'", "right": '+rightSum+', "all": 1}]');
    });
  }

  answerQuestion(index, nextQuestionIndex){
    if(this.currentQuestion.answer_index==-1){
      this.currentQuestion.answer_index = index;
      this.currentQuestion.answer_index = index;
      if(this.currentQuestion.answer[this.currentQuestion.answer_index.toString()].correct) this.storeData(true);
      else this.storeData(false);
      this.choseQuestion(nextQuestionIndex, true);
    }
  }

  checkMistakes(){
    console.log('show mistakes and theory');
    //todo: работа над ошибками
  }

  haveMistakes(){
    if(this.data.question.filter(e => !e.answer[e.answer_index.toString()].correct).length>0) return true;
    else return false;
  }

  rightAnswersCount(){
    return this.data.question.filter(
        e => e.answer[e.answer_index.toString()].correct
      ).length;
  }

  showStat() {
    this.events.publish('show:stat');
  }

  swipeEvent(e, currentQuestionIndex) {
    switch (e.direction){
      case 2: this.choseQuestion(currentQuestionIndex+1); break;
      case 4: this.choseQuestion(currentQuestionIndex-1); break;
      default: break;
    }
  }
}
