import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';
import { map, Observable } from 'rxjs';
import { NameCount } from '../models/name-count';
import { SortBy } from '../models/sort-by';

@Component({
  selector: 'app-authors',
  templateUrl: './authors.page.html',
  styleUrls: ['./authors.page.scss'],
  standalone: false
})
export class AuthorsPage {
  sortBy = SortBy.Name;
  sortAscendingByName = true;
  sortAscendingByCount = true;

  authors: Observable<NameCount[]>;
  total: Observable<number>; 

  constructor(private router: Router,
    private dataService: DataService
  ) { }

  get sortByNameIcon(): string {
    return this.sortAscendingByName ? 'chevron-up-outline' : 'chevron-down-outline';
  }
  
  get sortByCountIcon(): string {
    return this.sortAscendingByCount ? 'chevron-up-outline' : 'chevron-down-outline';
  }

  ionViewDidEnter() {
    this.sortByName();
  }

  sortByNameCommand() {
    this.sortAscendingByName = !this.sortAscendingByName;
    this.sortByName();
  }

  sortByName() {
    this.sortBy = SortBy.Name;
    this.authors = this.dataService.getAuthors(this.sortBy, this.sortAscendingByName);
    this.total = this.authors.pipe(
      map(items => items.reduce((acc, item) => acc + item.count, 0))
    );
  }

  sortByCountCommand() {
    this.sortAscendingByCount = !this.sortAscendingByCount;
    this.sortByCount();
  }

  sortByCount() {
    this.sortBy = SortBy.Count;
    this.authors = this.dataService.getAuthors(this.sortBy, this.sortAscendingByCount);
  }

  navigateByQuotedBy(person: string) {
    this.router.navigate(['tabs', 'home'], {
      queryParams: { quotedBy: person }
    });
  }
}
