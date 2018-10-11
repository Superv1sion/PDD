import { Component, ViewChild } from '@angular/core';
import { MenuController, Events } from 'ionic-angular';
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

  constructor(public menuCtrl: MenuController, public events: Events) {
    this.menuCtrl.enable(true);
    events.subscribe('theme:chosen', (theme) => {
      this.tabRef.select(1).then(function(){
        events.publish('theme:start:solve', theme);
      });
    });
    events.subscribe('chose:task', () => {
      this.tabRef.select(0);
    });
  }

  openMenu(){
    this.menuCtrl.open();
  }


}
