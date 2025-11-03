import { Component, OnDestroy } from '@angular/core';
import { DataService } from '../services/data.service';
import { QuoteRecord } from '../models/quote-record';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-quotes',
  templateUrl: './quotes.page.html',
  styleUrls: ['./quotes.page.scss'],
  standalone: false
})
export class QuotesPage implements OnDestroy {
  quotes: QuoteRecord[];
  filteredQuotes: QuoteRecord[];
  filteredQuotesCount: number;
  sub: Subscription;

  constructor(private dataService: DataService) { }

  ionViewDidEnter() {
    this.loadQuotes();
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  loadQuotes() {
    this.sub = this.dataService.getQuotes().subscribe(res => {
      this.quotes = res;
      this.filteredQuotes = res;
      this.filteredQuotesCount = res.length;
    });
  }

  filterItems(event: any) {
    const query = event.target.value.toLowerCase();
    this.filteredQuotes = this.quotes.filter(quote =>
      quote.quoteText.toLowerCase().includes(query)
    );
    this.filteredQuotesCount = this.filteredQuotes.length;
  }
}
