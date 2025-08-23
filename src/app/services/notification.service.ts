import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifySource = new Subject<number>();
  notify$ = this.notifySource.asObservable();

  send(quoteCount: number) {
    this.notifySource.next(quoteCount);
  }
}
