import { Component } from '@angular/core';
import { Share } from '@capacitor/share';
import { environment } from 'src/environments/environment';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  constructor(private authService: AuthService,
    private router: Router) {}

  get isLoggedIn(): boolean {
    return this.authService.user != null;
  }

  get photoURL(): string {
    return this.authService.photoURL;
  }

  getToProfile() {
    this.router.navigate(['tabs', 'profile']);
  }

  async share() {
    await Share.share({
      title: "Quotable",
      text: "Wise sayings",
      url: environment.siteUrl
    });
  }
}
