import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-authors',
  templateUrl: './authors.page.html',
  styleUrls: ['./authors.page.scss'],
  standalone: false
})
export class AuthorsPage {
  authors: Observable<string[]>;

  constructor(private router: Router,
    private dataService: DataService
  ) { }

  ionViewDidEnter() {
    this.authors = this.dataService.getAuthors();
  }

  navigateByQuotedBy(person: string) {
    this.router.navigate(['tabs', 'home'], {
      queryParams: { quotedBy: person }
    });
  }
}
