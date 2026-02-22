import { AuthService } from './../../services/auth.service';
import { Router } from '@angular/router';
import { Component, Input } from '@angular/core';
import { CurrentQuery } from 'src/app/models/current-query';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
  standalone: false
})
export class FilterComponent {
  @Input() currentQuery: CurrentQuery;

  get humorousFill(): string {
    return this.currentQuery == CurrentQuery.humorous ? 'outline' : 'fill';
  }

  get topLikesFill(): string {
    return this.currentQuery == CurrentQuery.topLikes ? 'outline' : 'fill';
  }

  get topLikesByMeFill(): string {
    return this.currentQuery == CurrentQuery.topLikesByMe ? 'outline' : 'fill';
  }

  get postedByMeFill(): string {
    return this.currentQuery == CurrentQuery.postedByMe ? 'outline' : 'fill';
  }

  get myOwnQuotesFill(): string {
    return this.currentQuery == CurrentQuery.myOwnQuotes ? 'outline' : 'fill';
  }

  constructor(private router: Router, private authService: AuthService) {}

  get isLoggedIn(): boolean {
    return this.authService.user != null;
  }

  showHumorousQuotes() {
    this.router.navigate(['tabs', 'home', CurrentQuery[CurrentQuery.humorous]]);
  }

  showTopQuotes() {
    this.router.navigate(['tabs', 'home', CurrentQuery[CurrentQuery.topLikes]]);
  }

  showTopQuotesILiked() {
    this.router.navigate(['tabs', 'home', CurrentQuery[CurrentQuery.topLikesByMe]]);
  }

  showQuotesPostedByMe() {
    this.router.navigate(['tabs', 'home', CurrentQuery[CurrentQuery.postedByMe]]);
  }

  showMyOwnQuotes() {
    this.router.navigate(['tabs', 'home', CurrentQuery[CurrentQuery.myOwnQuotes]]);
  }
}
