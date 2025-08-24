import { AuthService } from './../services/auth.service';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonTabs } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
  standalone: false
})
export class TabsPage {
  @ViewChild('tabs') tabs: IonTabs;
  quoteCount: number;

  constructor(private authService: AuthService,
    private router: Router) { }

  ionViewWillEnter() {
    if (this.router.url.toLowerCase().endsWith('tabs')
      || this.router.url.toLowerCase().indexOf('tabs?') >= 0) {
      this.tabs.select('home');
    }
  }

  get isLoggedIn(): boolean {
    return this.authService.user != null;
  }
}
