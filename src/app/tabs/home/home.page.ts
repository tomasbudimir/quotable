import { ModalLoginPage } from './../../auth/modal-login/modal-login.page';
import { QuoteRecord } from './../../models/quote-record';
import { DataService } from './../../services/data.service';
import { FontSizeService } from './../../services/font-size.service';
import { AuthService } from './../../services/auth.service';
import { AlertService } from 'src/app/services/alert.service';
import { FileService } from './../../services/file.service';
import { Component} from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';

enum CurrentQuery {
  Newest,
  TopLikes,
  PostedByMe,
  MyOwnQuotes,
  PrivateQuotes
}

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false
})
export class HomePage {
  quotes: Observable<QuoteRecord[]>;
  currentQuery: CurrentQuery;

  get newestFill(): string {
    return this.currentQuery == CurrentQuery.Newest ? 'outline' : 'fill';
  }

  get topLikesFill(): string {
    return this.currentQuery == CurrentQuery.TopLikes ? 'outline' : 'fill';
  }

  get postedByMeFill(): string {
    return this.currentQuery == CurrentQuery.PostedByMe ? 'outline' : 'fill';
  }

  get myOwnQuotesFill(): string {
    return this.currentQuery == CurrentQuery.MyOwnQuotes ? 'outline' : 'fill';
  }

  get privateQuotesFill(): string {
    return this.currentQuery == CurrentQuery.PrivateQuotes ? 'outline' : 'fill';
  }

  constructor(private fileService: FileService,
    private alertService: AlertService,
    private authService: AuthService,
    private dataService: DataService,
    private modalController: ModalController,
    private fontSizeService: FontSizeService
  ) { }

  ionViewDidEnter() {
    this.currentQuery = CurrentQuery.Newest;
    this.quotes = this.dataService.getQuotes();
  }

  showNewestQuotes() {
    this.currentQuery = CurrentQuery.Newest;
    this.quotes = this.dataService.getQuotes();
  }

  showTopQuotes() {
    this.currentQuery = CurrentQuery.TopLikes;
    this.quotes = this.dataService.getQuotesSortedByLikesCount();
  }

  showQuotesPostedByMe() {
    this.currentQuery = CurrentQuery.PostedByMe;
    this.quotes = this.dataService.getQuotesPostedByMe();
  }

  showMyOwnQuotes() { 
    this.currentQuery = CurrentQuery.MyOwnQuotes;
    this.quotes = this.dataService.getMyOwnQuotes();
  }

  showPrivateQuotes() {
    this.currentQuery = CurrentQuery.PrivateQuotes;
    this.quotes = this.dataService.getPrivateQuotes();
  }

  showQuotesByQuotedBy(quotedBy: string) {
    this.currentQuery = CurrentQuery.Newest;
    this.quotes = this.dataService.getQuotesByQuotedBy(quotedBy);
  }

  getFontSize(quoteText: string): number {
    return this.fontSizeService.getFontSize(quoteText);
  }

  isQuoteLikedByCurrentUser(quote: QuoteRecord): boolean {
    if (quote?.likes?.includes(this.authService?.user?.uid)) {
      return true;
    }

    return false;
  }
  
  getLikeIconName(quote: QuoteRecord): string {
    if (this.isQuoteLikedByCurrentUser(quote)) {
      return 'heart';
    }

    return 'heart-outline';
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

  async likingQuote(quote: QuoteRecord) {
    if (this.authService.user == null) {
      const result = await this.alertService.confirm('Sign in so you can like a quote', 'Do you want to sign in now?');

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

  async delete(quote: QuoteRecord) {
    const result = await this.alertService.confirm('Confirm', 'Are you sure you want to delete it?');

    if (result) {
      await this.dataService.deleteQuote(quote.id);
    }
  }
}
