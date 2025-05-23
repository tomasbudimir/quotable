import { FontSizeService } from './../../services/font-size.service';
import { ModalLoginPage } from './../../auth/modal-login/modal-login.page';
import { AlertService } from 'src/app/services/alert.service';
import { DataService } from './../../services/data.service';
import { AuthService } from './../../services/auth.service';
import { Router } from '@angular/router';
import { QuoteRecord } from './../../models/quote-record';
import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-quote',
  templateUrl: './quote.component.html',
  styleUrls: ['./quote.component.scss'],
  standalone: false
})
export class QuoteComponent {

  @Input() quote!: QuoteRecord;

  constructor(private router: Router,
    private authService: AuthService,
    private dataService: DataService,
    private alertService: AlertService,
    private fontSizeService: FontSizeService,
    private modalController: ModalController
  ) { }

  get isLoggedIn(): boolean {
    return this.authService.user != null;
  }

  getFontSize(quoteText: string): number {
    return this.fontSizeService.getFontSize(quoteText);
  }

  getLikeIconName(quote: QuoteRecord): string {
    if (this.isQuoteLikedByCurrentUser(quote)) {
      return 'heart';
    }

    return 'heart-outline';
  }

  isFacebookLogin(quote: QuoteRecord): boolean {
    return this.isMyPost(quote)
      && this.authService.user?.providerData[0].providerId == 'facebook.com';
  }

  isMyPost(quote: QuoteRecord): boolean {
    return this.isLoggedIn 
      && this.authService.user?.uid == quote.uid;
  }

  async likingQuote(quote: QuoteRecord) {
    if (this.authService.user == null) {
      const result = await this.alertService.confirm('Liking a quote requires sign-in', 'Do you want to sign in for free?');

      if (result) {
        const modal = await this.modalController.create({
          component: ModalLoginPage,
          breakpoints: [0, 0.5, 0.8],
          initialBreakpoint: 0.5
        });

        modal.present();
      }
    } else {
      if (this.isQuoteLikedByCurrentUser(quote)) {
        this.dataService.unlikeTheQuote(quote);  
      } else {
        this.dataService.likeTheQuote(quote);
      }
    }
  }

  isQuoteLikedByCurrentUser(quote: QuoteRecord): boolean {
    if (quote?.likes?.includes(this.authService?.user?.uid)) {
      return true;
    }

    return false;
  }
}
