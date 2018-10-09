import { Component } from '@angular/core';
import { MenuController } from 'ionic-angular';

import { WorkPage } from '../work/work';
import { StatPage } from '../stat/stat';
import { HomePage } from '../home/home';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = WorkPage;
  tab3Root = StatPage;

  constructor(public menuCtrl: MenuController) {
    this.menuCtrl.enable(true);
  }

  openMenu(){
    this.menuCtrl.open();
  }
}
