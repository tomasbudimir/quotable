import { DataService } from './../../services/data.service';
import { FontSizeService } from './../../services/font-size.service';
import { AuthService } from './../../services/auth.service';
import { AlertService } from 'src/app/services/alert.service';
import { FileService } from './../../services/file.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import { QuoteRecord } from 'src/app/models/quote-record';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false
})
export class HomePage {

  quotes: Observable<QuoteRecord[]>;

  constructor(private fileService: FileService,
    private loadingController: LoadingController,
    private alertService: AlertService,
    private authService: AuthService,
    private dataService: DataService,
    private fontSizeService: FontSizeService
  ) { }

  ionViewDidEnter() {
    this.quotes = this.dataService.getQuotes();
  }

  getFontSize(quoteText: string): number {
    return this.fontSizeService.getFontSize(quoteText);
  }

  get isLoggedIn(): boolean {
    return this.authService.user != null;
  }

  isFacebookLogin(quote: QuoteRecord): boolean {
    return this.isMyPost(quote)
      && this.authService.user?.providerData[0].providerId == 'facebook.com';
  }

  isMyPost(quote: QuoteRecord): boolean {
    return this.isLoggedIn 
      && this.authService.user?.uid == quote.uid;
  }

  likingQuote() {
    if (this.authService.user == null) {
      this.alertService.show('Not logged in', 'You must be logged in to like a quote!');
      return;
    }
  }

  async delete(quote: QuoteRecord) {
    const result = await this.alertService.confirm('Confirm', 'Are you sure you want to delete it?');

    if (result) {
      await this.dataService.deleteQuote(quote.id);
    }
  }
}
