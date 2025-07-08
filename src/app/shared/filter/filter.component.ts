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

  get newestFill(): string {
    return this.currentQuery == CurrentQuery.Newest ? 'outline' : 'fill';
  }

  get topLikesFill(): string {
    return this.currentQuery == CurrentQuery.TopLikes ? 'outline' : 'fill';
  }

  get topLikesByMeFill(): string {
    return this.currentQuery == CurrentQuery.TopLikesByMe ? 'outline' : 'fill';
  }

  get postedByMeFill(): string {
    return this.currentQuery == CurrentQuery.PostedByMe ? 'outline' : 'fill';
  }

  get myOwnQuotesFill(): string {
    return this.currentQuery == CurrentQuery.MyOwnQuotes ? 'outline' : 'fill';
  }

  get privateQuotesFill(): string {
    return this.currentQuery == CurrentQuery.PrivateQuotes ? 'outline' : 'fill';
  }

  constructor(private router: Router,
    private authService: AuthService
  ) { 
    this.currentQuery = CurrentQuery.Newest;
  }

  get isLoggedIn(): boolean {
    return this.authService.user != null;
  }

  showNewestQuotes() {
    this.router.navigate(['tabs', 'home', Number(CurrentQuery.Newest)]);
  }

  showTopQuotes() {
    this.router.navigate(['tabs', 'home', Number(CurrentQuery.TopLikes)]);
  }

  showTopQuotesILiked() {
    this.router.navigate(['tabs', 'home', Number(CurrentQuery.TopLikesByMe)]);
  }

  showQuotesPostedByMe() {
    this.router.navigate(['tabs', 'home', Number(CurrentQuery.PostedByMe)]);
  }

  showMyOwnQuotes() {
    this.router.navigate(['tabs', 'home', Number(CurrentQuery.MyOwnQuotes)]);
  }

  showPrivateQuotes() {
    this.router.navigate(['tabs', 'home', Number(CurrentQuery.PrivateQuotes)]);
  }

  showAuthors() {
    this.router.navigateByUrl('/authors');
  }
}
