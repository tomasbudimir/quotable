import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../../services/data.service';
import { QuoteRecord } from '../../models/quote-record';
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
  displayedQuote: string;
  displayedAuthor: string;
  isClickable: boolean;

  constructor(private router: Router,
    private dataService: DataService,
    private fontSizeService: FontSizeService
  ) { }

  ionViewDidEnter() {    
    this.isClickable = true;
    let i = 0;
    this.dataService.getUnsortedQuotes().subscribe(res => {
      if (res) {
        this.quotes = res;
        this.showAnother();
      } else {
        this.router.navigate(['/tabs']);
      }
    });
  }

  ionViewDidLeave() {
    this.displayedQuote = '';
    this.displayedAuthor = '';
    this.quote = null;
  }

  navigateByQuotedBy(quotedBy: string) {
    this.router.navigate(['tabs', 'home'], {
      queryParams: { quotedBy }
    });
  }

  getFontSize(quoteText: string): number {
    return this.fontSizeService.getBiggerFontSize(quoteText);
  }

  getIndex(size: number): number {
    return Math.floor(Math.random() * size);
  }

  showAnother() {
    if (this.isClickable && this.quotes) {
      this.isClickable = false;

      const index = this.getIndex(this.quotes.length);
      this.quote = this.quotes[index];

      this.displayedQuote = '';
      this.displayedAuthor = '';

      this.typeQuote();
    }
  }

  typeQuote(i: number = 0) {
    if (i < this.quote.quoteText.length) {
      this.displayedQuote += this.quote.quoteText.charAt(i);
      setTimeout(() => this.typeQuote(i + 1), 50);
    } else {
      this.typeAuthor();
    }
  }

  typeAuthor(i: number = 0) {
    if (i < this.quote.quotedBy.length) {
      this.displayedAuthor += this.quote.quotedBy.charAt(i);
      setTimeout(() => this.typeAuthor(i + 1), 50);
    }

    this.isClickable = true;
  }
}
