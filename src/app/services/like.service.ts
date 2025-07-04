import { Injectable } from '@angular/core';
import { QuoteRecord } from '../models/quote-record';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class LikeService {

  constructor(private authService: AuthService) {}

  isQuoteLikedByCurrentUser(quote: QuoteRecord): boolean {
    if (quote?.likes?.includes(this.authService?.user?.uid)) {
      return true;
    }

    return false;
  }
  
  getLikeIconName(quote: QuoteRecord): string {
    if (this.isQuoteLikedByCurrentUser(quote)) {
      return 'thumbs-up';
    }

    return 'thumbs-up-outline';
  }
}
