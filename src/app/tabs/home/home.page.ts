import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { ModalLoginPage } from './../../auth/modal-login/modal-login.page';
import { QuoteRecord } from './../../models/quote-record';
import { DataService } from './../../services/data.service';
import { FontSizeService } from './../../services/font-size.service';
import { AuthService } from './../../services/auth.service';
import { AlertService } from 'src/app/services/alert.service';
import { FileService } from './../../services/file.service';
import { Component, ViewChild} from '@angular/core';
import { IonContent, ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Share } from '@capacitor/share';

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
  @ViewChild('content') content!: IonContent;
  private savedScrollTop = 0;
  
  quotes: Observable<QuoteRecord[]>;
  currentQuery: CurrentQuery;
  isShowMoreVisible: boolean;

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
    private router: Router,
    private modalController: ModalController,
    private fontSizeService: FontSizeService
  ) { }

  ionViewDidEnter() {
    this.currentQuery = CurrentQuery.Newest;
    this.quotes = this.dataService.getQuotes(9);
    this.isShowMoreVisible = true;
  }

  async showAll() {
    // Save scroll position
    const scroller = await this.content.getScrollElement();
    this.savedScrollTop = scroller.scrollTop;

    // Do something that might affect scroll
    switch (this.currentQuery) {
      case CurrentQuery.Newest:
        this.showNewestQuotes();
        break;
      case CurrentQuery.TopLikes:
        this.showTopQuotes();
        break;
      case CurrentQuery.PostedByMe:
        this.showQuotesPostedByMe();
        break;
      case CurrentQuery.MyOwnQuotes:
        this.showMyOwnQuotes();
        break;
      case CurrentQuery.PrivateQuotes:
        this.showPrivateQuotes();
        break;
    }

    this.content.scrollToPoint(0, this.savedScrollTop + 400, 2000);
  }

  showNewestQuotes() {
    this.currentQuery = CurrentQuery.Newest;
    this.quotes = this.dataService.getQuotes();
    this.isShowMoreVisible = false;
  }

  showTopQuotes() {
    this.currentQuery = CurrentQuery.TopLikes;
    this.quotes = this.dataService.getQuotesSortedByLikesCount();
    this.isShowMoreVisible = false;
  }

  showQuotesPostedByMe() {
    this.currentQuery = CurrentQuery.PostedByMe;
    this.quotes = this.dataService.getQuotesPostedByMe();
    this.isShowMoreVisible = false;    
  }

  showMyOwnQuotes() { 
    this.currentQuery = CurrentQuery.MyOwnQuotes;
    this.quotes = this.dataService.getMyOwnQuotes();
    this.isShowMoreVisible = false;
  }

  showPrivateQuotes() {
    this.currentQuery = CurrentQuery.PrivateQuotes;
    this.quotes = this.dataService.getPrivateQuotes();
    this.isShowMoreVisible = false;
  }

  showQuotesByQuotedBy(quotedBy: string) {
    this.currentQuery = CurrentQuery.Newest;
    this.quotes = this.dataService.getQuotesByQuotedBy(quotedBy);
    this.isShowMoreVisible = false;
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

  async delete(quote: QuoteRecord) {
    const result = await this.alertService.confirm('Confirm', 'Are you sure you want to delete it?');

    if (result) {
      await this.dataService.deleteQuote(quote.id);
      this.alertService.showToast('Quote successfully deleted.', 'close-outline', 'warning');
    }
  }

  navigateToOneQuote(id: string) {
    this.router.navigate(['/one-quote', id]);
  }

  async share(quote: QuoteRecord) {
    await Share.share({
      title: quote.quotedBy,
      text: quote.quoteText,
      url: environment.siteUrl + '/one-quote/' + quote.id
    });
  }
}
