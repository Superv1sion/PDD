import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Slides, Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'page-work',
  templateUrl: 'work.html'
})
export class WorkPage {
  @ViewChild(Slides) slider: Slides;

  testEnded = false;
  dataFiled = false;
  isRandom = false;
  isDebug = false;
  localization: string;
  loc: any;
  data_index: any;
  data: any;
  currentQuestion: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public events: Events, private storage: Storage, public http: HttpClient) {
    this.loc =[];
    events.subscribe('theme:start:solve', (theme, index) => {
      this.data = theme;
      this.data_index = index;
      this.data.question.forEach((element, index) => {
        element.answer_index = -1;
        element.index = index;
      });
      this.currentQuestion = this.data.question[0];
      if(theme.is_random) this.isRandom = true;
      else this.isRandom = false;
      this.dataFiled = true;
      this.testEnded = false;
      if(this.slider) this.slider.slideTo(0);
    });
  }

  ionViewWillEnter(){
    this.storage.get('localization').then(data => {
      if(data!==null) this.localization = data;
      else this.localization = "ru";
      this.Translate();
    })
  }

  Translate(){
    this.storage.set('localization', this.localization);
    if(this.data) this.http.get<any[]>('assets/data/data-'+this.localization+'.json').subscribe(data => {
      if(!this.isRandom) {
        this.data.theme = data[this.data_index].theme;
        this.data.question.forEach((e, i) =>{
          e.text = data[this.data_index].question[i].text;
          e.pdd = data[this.data_index].question[i].pdd;
          e.help = data[this.data_index].question[i].help;
          e.answer.forEach((q, j) => q.text = data[this.data_index].question[i].answer[j].text);
        });
      }
      else {
        this.data_index.forEach((e, i) => {
          this.data.question[i].text = data[e.first].question[e.second].text;
          this.data.question[i].answer.forEach((q, j) => q.text = data[e.first].question[e.second].answer[j].text);
        });
      }
    });
    this.http.get<any>('assets/data/localization-'+this.localization+'.json').subscribe(data => {
      this.loc = data.work;
      if(this.isRandom && this.data) this.data.theme = data.home.random;
    });
  }

  choseTask(){
    this.testEnded = false;
    this.dataFiled = false;
    delete this.data;
    this.events.publish('chose:task');
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
    if(this.currentQuestion.answer_index===-1){
      this.currentQuestion.answer_index = index;
      this.currentQuestion.answer_index = index;
      if(this.currentQuestion.answer[this.currentQuestion.answer_index.toString()].correct) this.storeData(true);
      else this.storeData(false);
      this.choseQuestion(nextQuestionIndex, true);
    }
  }

  checkMistakes(){
    var newData = this.data;
    newData.question = newData.question.filter(e => !e.answer[e.answer_index].correct);
    newData.question.forEach((element, index) => {
      element.answer_index = -1;
      element.index = index;
    });
    delete this.data;
    this.data = newData;
    this.currentQuestion = this.data.question[0];
    if(this.slider) this.slider.slideTo(0);
    this.isDebug = true;
    this.testEnded = false;
    this.dataFiled = true;
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

  nextTask(){
    this.testEnded = false;
    this.dataFiled = false;
    delete this.data;
    this.events.publish('next:task');
  }

  swipeEvent(e, currentQuestionIndex) {
    switch (e.direction){
      case 2: this.choseQuestion(currentQuestionIndex+1); break;
      case 4: this.choseQuestion(currentQuestionIndex-1); break;
      default: break;
    }
  }
}
