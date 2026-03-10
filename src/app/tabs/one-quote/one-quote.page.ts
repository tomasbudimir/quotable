import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../../services/data.service';
import { QuoteRecord } from '../../models/quote-record';
import { FontSizeService } from '../../services/font-size.service';
import { CurrentQuery } from 'src/app/models/current-query';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-one-quote',
  templateUrl: './one-quote.page.html',
  styleUrls: ['./one-quote.page.scss'],
  standalone: false
})
export class OneQuotePage implements OnDestroy {
  @ViewChild('myCanvas', { static: false }) myCanvas!: ElementRef<HTMLCanvasElement>;
  allQuotes: QuoteRecord[] = [];
  quotes: QuoteRecord[] = [];
  authors: string[] = [];
  filteredAuthors: string[] = [];
  author: string;

  sub: Subscription;

  quote: QuoteRecord = null;
  displayedQuote: string;
  displayedAuthor: string;
  isClickable: boolean;
  isPlaying: boolean;
  isShowOnlyFunny: boolean;
  isRandom: boolean;
  index: number = 0;

  constructor(private router: Router,
    private dataService: DataService,
    private fontSizeService: FontSizeService
  ) { }

  ionViewDidEnter() {    
    this.isClickable = true;
    let i = 0;
    this.sub = this.dataService.getUnsortedQuotes().subscribe(res => {
      if (res) {
        this.allQuotes = res;
        this.quotes = res;
        this.authors = [...new Set(res.map(q => q.quotedBy))] as string[];
        this.author = '';
        this.isShowOnlyFunny = false;
        this.randomize();
        this.showAnother();
      } else {
        this.router.navigate(['/tabs']);
      }
    });
  }

  ngOnDestroy(): void {
    this.displayedQuote = '';
    this.displayedAuthor = '';
    this.quote = null;
    this.sub?.unsubscribe();
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
    if (this.isRandom) {
      return Math.floor(Math.random() * size);
    } else {
      return this.index++ % this.quotes.length;
    }
  }

  showAnother() {
    if (this.isClickable && this.quotes && this.quotes.length) {
      this.isClickable = false;

      const index = this.getIndex(this.quotes.length);
      this.quote = this.quotes[index];

      this.displayedQuote = '';
      this.displayedAuthor = '';

      this.typeQuote();
    }
  }

  playPause() {
    this.isPlaying = !this.isPlaying;

    if (this.isPlaying && this.isClickable) {
      this.showAnother();
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

    if (this.isPlaying) {
      setTimeout(() => this.showAnother(), 3000);
    }
  }

  onShowOnlyFunnyQuotesChange(event: any) {
    this.isShowOnlyFunny = event.detail.checked;

    if (event.detail.checked) {
      this.author = '';
      this.quotes = this.allQuotes.filter(quote => {
        if (quote.categories) {
          return quote.categories.some(category => category == CurrentQuery[CurrentQuery.humorous]);
        } else {
          return false;
        }
      });
      this.unrandomize();
    } else {
      this.quotes = this.allQuotes;
      this.randomize();
    }
  }

  filterAuthors(event: any) {
    const input = event.target.value?.toLowerCase() || '';

    if (!input) {
      this.filteredAuthors = [];      
      this.quotes = this.allQuotes;
      this.randomize();
    } else {
      this.filteredAuthors = this.authors.filter(author => author.toLowerCase().startsWith(input));
      this.isShowOnlyFunny = false;
      this.unrandomize();
    }
  }

  selectAuthor(input: any) {
    this.author = input;
    this.filteredAuthors = [];
    this.isShowOnlyFunny = false;
    this.unrandomize();

    this.quotes = this.allQuotes.filter(quote => quote.quotedBy == this.author);
  }

  randomize(): void {
    this.isRandom = true;
  }
  
  unrandomize(): void {
    this.index = 0;
    this.isRandom = false;
  }
}
