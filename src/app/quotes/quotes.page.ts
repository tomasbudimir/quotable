import { Component } from '@angular/core';
import { DataService } from '../services/data.service';
import { QuoteRecord } from '../models/quote-record';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-quotes',
  templateUrl: './quotes.page.html',
  styleUrls: ['./quotes.page.scss'],
  standalone: false
})
export class QuotesPage {
  quotes: QuoteRecord[];
  filteredQuotes: QuoteRecord[];

  constructor(private dataService: DataService) { }

  ionViewDidEnter() {
    this.loadQuotes();
  }

  loadQuotes() {
    firstValueFrom(this.dataService.getQuotes()).then(res => {
      this.quotes = res;
      this.filteredQuotes = res;
    });
  }

  filterItems(event: any) {
    const query = event.target.value.toLowerCase();
    this.filteredQuotes = this.quotes.filter(quote =>
      quote.quoteText.toLowerCase().includes(query)
    );
  }
}
