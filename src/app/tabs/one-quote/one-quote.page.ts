import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../../services/data.service';
import { QuoteRecord } from '../../models/quote-record';
import { AuthService } from '../../services/auth.service';
import { AlertService } from '../../services/alert.service';
import { FontSizeService } from '../../services/font-size.service';
import { ModalController } from '@ionic/angular';
import { ModalLoginPage } from '../../auth/modal-login/modal-login.page';
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
    private authService: AuthService,
    private dataService: DataService,
    private alertService: AlertService,
    private fontSizeService: FontSizeService,
    private modalController: ModalController
  ) { }

  ionViewDidEnter() {
    this.dataService.getQuotes().subscribe(res => {
      if (res) {
        const index = Math.floor(Math.random() * res.length);

        this.quote = res[index];
      } else {
        this.router.navigate(['/tabs']);
      }
    });
  }

  get isLoggedIn(): boolean {
    return this.authService.user != null;
  }

  getFontSize(quoteText: string): number {
    return this.fontSizeService.getBiggerFontSize(quoteText);
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

  isQuoteLikedByCurrentUser(quote: QuoteRecord): boolean {
    if (quote?.likes?.includes(this.authService?.user?.uid)) {
      return true;
    }

    return false;
  }

  async downloadImage(quote: QuoteRecord) {
    const element = document.getElementById(quote.id);
    if (!element) return;

    await html2canvas(element).then((canvas) => {
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = quote.quoteText.substring(0, 20) + '.png';
      link.click();
    });
  }
}
