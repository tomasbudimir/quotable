import { environment } from 'src/environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalLoginPage } from './../../auth/modal-login/modal-login.page';
import { QuoteRecord } from './../../models/quote-record';
import { DataService } from './../../services/data.service';
import { FontSizeService } from './../../services/font-size.service';
import { AuthService } from './../../services/auth.service';
import { AlertService } from 'src/app/services/alert.service';
import { FileService } from './../../services/file.service';
import { Component } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Share } from '@capacitor/share';
import { LikeService } from 'src/app/services/like.service';
import { CurrentQuery } from 'src/app/models/current-query';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false
})
export class HomePage {
  quotes: QuoteRecord[];
  currentQuery: CurrentQuery;
  isShowMoreVisible: boolean;
  sub: Subscription;
  visibles: boolean[] = [];
  loadCount: number = 24;
  isScrollActive: boolean = false;

  constructor(private fileService: FileService,
    private alertService: AlertService,
    private authService: AuthService,
    private dataService: DataService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private likeService: LikeService,
    private modalController: ModalController,
    private fontSizeService: FontSizeService,
    private platform: Platform
  ) { }

  isVisible(index: number): boolean {
    if (!this.platform.is('desktop')) {
      return true;
    }

    return this.visibles[index];
  }

  async ionViewDidEnter() {
    this.currentQuery = CurrentQuery.Newest;

    try {
      this.activatedRoute.queryParams.subscribe(params => {
        const quotedBy = params['quotedBy'];
        
        if (quotedBy) {
          this.showQuotesByQuotedBy(quotedBy);
          this.isScrollActive = false;
          return;
        } else {
          const view = this.activatedRoute.snapshot.paramMap.get('view');

          if (view && +view <= Number(CurrentQuery.PrivateQuotes)) {
            this.currentQuery = +view as CurrentQuery;
            this.showCurrent();
          } else {
            this.loadDefaultHome();
          }
        }
      });
    } catch {
      this.loadDefaultHome();
    }
  }

  ionViewDidLeave() {
    this.sub?.unsubscribe();
  }

  loadMore(event: any) {
    setTimeout(() => {
      this.loadCount += 24;
      this.loadDefaultHome();
      event.target.complete();
    }, 1000);
  }

  checkBrowser() {
    window.addEventListener('load', () => {
      if (this.platform.is('desktop')) {
        console.log('Page fully loaded on desktop browser');
        // Your desktop-specific logic here
      } else {
        console.log('Page loaded on mobile device or non-desktop browser');
      }
    });
  }

  async loadDefaultHome() {
    this.isScrollActive = true;

    this.sub = this.dataService.getQuotes(this.loadCount).subscribe(res => {
      this.quotes = res;
      this.isShowMoreVisible = true;
    });
  }

  async showCurrent() {
    this.isScrollActive = false;

    switch (this.currentQuery) {
      case CurrentQuery.Newest:
        this.showNewestQuotes();
        break;
      case CurrentQuery.TopLikes:
        this.showTopQuotes();
        break;
      case CurrentQuery.TopLikesByMe:
        this.showTopQuotesILiked();
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
  }

  showNewestQuotes() {
    this.currentQuery = CurrentQuery.Newest;
    this.sub = this.dataService.getQuotes().subscribe(res => {
      this.quotes = res;
    });
    this.isShowMoreVisible = false;
  }

  showTopQuotes() {
    this.currentQuery = CurrentQuery.TopLikes;
    this.sub = this.dataService.getQuotesSortedByLikes().subscribe(res => {
      this.quotes = res;
    });
    this.isShowMoreVisible = false;
  }

  showTopQuotesILiked() {
    this.currentQuery = CurrentQuery.TopLikesByMe;

    if (this.authService?.user) {
      this.sub = this.dataService.getQuotesILiked().subscribe(res => {
        this.quotes = res;
      });
      this.isShowMoreVisible = false;
    } else {
      this.showNewestQuotes();
    }
  }

  showQuotesPostedByMe() {
    this.currentQuery = CurrentQuery.PostedByMe;

    if (this.authService?.user) {
      this.sub = this.dataService.getQuotesPostedByMe().subscribe(res => {
        this.quotes = res;
      });
      this.isShowMoreVisible = false;
    } else {
      this.showNewestQuotes();
    }   
  }

  showMyOwnQuotes() { 
    this.currentQuery = CurrentQuery.MyOwnQuotes;

    if (this.authService?.user) {
      this.sub = this.dataService.getMyOwnQuotes().subscribe(res => {
        this.quotes = res;
      });
      this.isShowMoreVisible = false;
    } else {
      this.showNewestQuotes();
    }   
  }

  showPrivateQuotes() {
    this.currentQuery = CurrentQuery.PrivateQuotes;

    if (this.authService?.user) {
      this.sub = this.dataService.getPrivateQuotes().subscribe(res => {
        this.quotes = res;
      });
      this.isShowMoreVisible = false;
    } else {
      this.showNewestQuotes();
    }  
  }

  navigateByQuotedBy(quotedBy: string) {
    this.router.navigate(['tabs', 'home'], {
      queryParams: { quotedBy }
    });
    this.showQuotesByQuotedBy(quotedBy);
  }

  showQuotesByQuotedBy(quotedBy: string) {
    this.currentQuery = CurrentQuery.Newest;
    this.sub= this.dataService.getQuotesByQuotedBy(quotedBy).subscribe(res => {
      this.quotes = res;
    });
    this.isShowMoreVisible = false;
  }

  getFontSize(quoteText: string): number {
    return this.fontSizeService.getFontSize(quoteText);
  }
  
  getLikeIconName(quote: QuoteRecord): string {
    return this.likeService.getLikeIconName(quote);
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
      const result = await this.alertService.confirm('Liking a quote requires sign-in', 'Do you want to sign in? It is free.');

      if (result) {
        const modal = await this.modalController.create({
          component: ModalLoginPage,
          breakpoints: [0, 0.5, 0.8],
          initialBreakpoint: 0.5
        });

        modal.present();
      }
    } else {
      if (this.likeService.isQuoteLikedByCurrentUser(quote)) {
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
      this.alertService.showToast('Quote successfully deleted.', 'trash-outline', 'warning');
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
