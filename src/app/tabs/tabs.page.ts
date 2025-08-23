import { AuthService } from './../services/auth.service';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonTabs } from '@ionic/angular';
import { DataService } from '../services/data.service';
import { NotificationService } from '../services/notification.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
  standalone: false
})
export class TabsPage implements OnInit, OnDestroy {
  @ViewChild('tabs') tabs: IonTabs;
  quoteCount: number;
  private sub!: Subscription;

  constructor(private authService: AuthService, 
    private notificationService: NotificationService,
    private dataService: DataService, 
    private router: Router) { }

  ngOnInit() {
    this.dataService.getQuoteCount().then(res => this.quoteCount = res);
    this.sub = this.notificationService.notify$.subscribe(count => this.quoteCount = count);
  }

  ngOnDestroy() {
    this.sub?.unsubscribe(); // prevent memory leaks
  }

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
