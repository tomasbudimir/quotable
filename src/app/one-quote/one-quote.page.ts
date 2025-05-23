import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../services/data.service';
import { QuoteRecord } from '../models/quote-record';

@Component({
  selector: 'app-one-quote',
  templateUrl: './one-quote.page.html',
  styleUrls: ['./one-quote.page.scss'],
  standalone: false
})
export class OneQuotePage {
  quote: QuoteRecord = null;

  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private dataService: DataService
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
}
