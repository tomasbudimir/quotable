import { AuthService } from './../services/auth.service';
import { Component, ViewChild } from '@angular/core';
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

  constructor(private authService: AuthService, 
    private router: Router) { }

  ionViewWillEnter() {
    if (this.router.url.toLowerCase().endsWith('tabs')) {
      this.tabs.select('home');
    }
  }

  get isLoggedIn(): boolean {
    return this.authService.user != null;
  }
}
