import { Component, ViewChild } from '@angular/core';
import { Events } from 'ionic-angular';
import { Tabs } from 'ionic-angular';

import { WorkPage } from '../work/work';
import { StatPage } from '../stat/stat';
import { HomePage } from '../home/home';

@Component({
  templateUrl: 'tabs.html',
})
export class TabsPage {

  @ViewChild('tabs') tabRef: Tabs;

  tab1Root = HomePage;
  tab2Root = WorkPage;
  tab3Root = StatPage;

  constructor(public events: Events) {
    events.subscribe('theme:chosen', (theme, index) => {
      this.tabRef.select(1).then(function(){
        events.publish('theme:start:solve', theme, index);
      });
    });
    events.subscribe('chose:task', () => {
      this.tabRef.select(0);
    });
    events.subscribe('show:stat', () => {
      this.tabRef.select(2);
    });
    events.subscribe('next:task', () => {
      this.tabRef.select(1);
      events.publish('next:task:generate');
    });
  }


}
