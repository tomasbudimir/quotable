import { Component, ElementRef, ViewChild } from '@angular/core';
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

  constructor(private router: Router,
    private dataService: DataService,
    private fontSizeService: FontSizeService
  ) { }

  ionViewWillEnter() {
    this.quote = null;
  }

  ionViewDidEnter() {
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
    if (this.quotes && this.quotes.length > 9) {
      const index = this.getIndex(this.quotes.length);
      this.quote = this.quotes[index];
    }
  }
}
