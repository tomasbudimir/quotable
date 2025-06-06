import { environment } from './../../environments/environment';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../services/data.service';
import { QuoteRecord } from '../models/quote-record';
import { AuthService } from '../services/auth.service';
import { AlertService } from '../services/alert.service';
import { FontSizeService } from '../services/font-size.service';
import { ModalController } from '@ionic/angular';
import { ModalLoginPage } from '../auth/modal-login/modal-login.page';
import { Share } from '@capacitor/share';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-one-quote',
  templateUrl: './one-quote.page.html',
  styleUrls: ['./one-quote.page.scss'],
  standalone: false
})
export class OneQuotePage {
  @ViewChild('myCanvas', { static: false }) myCanvas!: ElementRef<HTMLCanvasElement>;
  quote: QuoteRecord = null;

  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private dataService: DataService,
    private alertService: AlertService,
    private fontSizeService: FontSizeService,
    private modalController: ModalController
  ) { }

  ionViewDidEnter() {
    const quoteId = this.activatedRoute.snapshot.paramMap.get('id');

    if (quoteId) {
      this.dataService.getQuoteById(quoteId).subscribe(res => {
        if (res) {
          this.quote = res;
        } else {
          this.router.navigate(['/tabs']);
        }
      });
    } else {
      this.router.navigate(['/tabs']);
    }
  }

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

  isMyPost(quote: QuoteRecord): boolean {
    return this.isLoggedIn 
      && this.authService.user?.uid == quote.uid;
  }

  async likingQuote(quote: QuoteRecord) {
    if (this.authService.user == null) {
      const result = await this.alertService.confirm('Liking a quote requires sign-in', 
        'Do you want to sign in for free?');

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

  async share(quote: QuoteRecord) {
    await Share.share({
      title: quote.quotedBy,
      text: quote.quoteText,
      url: environment.siteUrl + '/one-quote/' + quote.id
    });
  }

  
  async downloadImage(quote: QuoteRecord) {
    const element = document.getElementById(quote.id);
    if (!element) return;

    await this.captureTopPart(element).then((canvas) => {
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = 'captured-image.png';
      link.click();
    });
  }

  async captureTopPart(element: HTMLElement): Promise<HTMLCanvasElement> {
    const fullCanvas = await html2canvas(element);

    const croppedHeight = fullCanvas.height - 62; // Remove toolbar from image
    const croppedWidth = fullCanvas.width;

    // Create a new canvas to hold cropped image
    const croppedCanvas = document.createElement('canvas');
    croppedCanvas.width = croppedWidth;
    croppedCanvas.height = croppedHeight;

    const ctx = croppedCanvas.getContext('2d');
    if (!ctx) throw new Error('Cannot get canvas context');

    ctx.drawImage(fullCanvas, 0, 0, croppedWidth, croppedHeight, 0, 0, croppedWidth, croppedHeight);

    return croppedCanvas;
  }
}
