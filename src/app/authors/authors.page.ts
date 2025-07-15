import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';
import { Observable } from 'rxjs';
import { NameCount } from '../models/name-count';
import { SortBy } from '../models/sort-by';

@Component({
  selector: 'app-authors',
  templateUrl: './authors.page.html',
  styleUrls: ['./authors.page.scss'],
  standalone: false
})
export class AuthorsPage {
  authors: Observable<NameCount[]>;

  constructor(private router: Router,
    private dataService: DataService
  ) { }

  ionViewDidEnter() {
    this.authors = this.dataService.getAuthors(SortBy.Name);
  }

  sortByName() {
    this.authors = this.dataService.getAuthors(SortBy.Name);
  }

  sortByCount() {
    this.authors = this.dataService.getAuthors(SortBy.Count);
  }

  navigateByQuotedBy(person: string) {
    this.router.navigate(['tabs', 'home'], {
      queryParams: { quotedBy: person }
    });
  }
}
