import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FontSizeService {
  
  getFontSize(quote: string): number {
    if (!quote) {
      return 24;
    }    

    if (quote.length < 50) {
      return 24;
    } else if (quote.length < 100) {
      return 21;
    } else if (quote.length < 200) {
      return 19;
    } else if (quote.length < 300) {
      return 17;
    } else if (quote.length < 400) {
      return 16;
    } else if (quote.length < 500) {
      return 14;
    } else if (quote.length < 600) {
      return 12;
    } else if (quote.length < 700) {
      return 11;
    } else if (quote.length < 800) {
      return 10;
    } 

    return 9;
  }
}
