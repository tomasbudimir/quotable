import { AuthService } from './../services/auth.service';
import { Component, ViewChild } from '@angular/core';
import { IonTabs } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
  standalone: false
})
export class TabsPage {
  @ViewChild('tabs') tabs: IonTabs;

  constructor(private authService: AuthService) { }

  get isLoggedIn(): boolean {
    return this.authService.user != null;
  }
}
