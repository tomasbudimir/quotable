import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../../services/data.service';
import { QuoteRecord } from '../../models/quote-record';
import { AuthService } from '../../services/auth.service';
import { FontSizeService } from '../../services/font-size.service';

@Component({
  selector: 'app-one-quote',
  templateUrl: './one-quote.page.html',
  styleUrls: ['./one-quote.page.scss'],
  standalone: false
})
export class OneQuotePage {
  @ViewChild('myCanvas', { static: false }) myCanvas!: ElementRef<HTMLCanvasElement>;
  quotes: QuoteRecord[] = [];
  quote: QuoteRecord = null;

  constructor(private router: Router,
    private authService: AuthService,
    private dataService: DataService,
    private fontSizeService: FontSizeService
  ) { }

  ionViewDidEnter() {
    this.dataService.getQuotes().subscribe(res => {
      if (res) {
        this.quotes = res;

        const index = this.getIndex(res.length);
        this.quote = this.quotes[index];
      } else {
        this.router.navigate(['/tabs']);
      }
    });
  }

  getFontSize(quoteText: string): number {
    return this.fontSizeService.getBiggerFontSize(quoteText);
  }

  getIndex(size: number): number {
    return Math.floor(Math.random() * size);
  }

  showAnother() {
      const index = this.getIndex(this.quotes.length);
      this.quote = this.quotes[index];
  }
}
