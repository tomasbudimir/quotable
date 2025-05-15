import { AuthService } from './../../services/auth.service';
import { AlertService } from './../../services/alert.service';

import { Router } from '@angular/router';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: false
})
export class HeaderComponent {
  @Input() title!: string;

  constructor(private authService: AuthService,
    private router: Router,
    private alertService: AlertService
  ) { }

  logout() {
    this.authService.logout().then(() => {
      this.router.navigate(['/login']);
    }).catch(error => {
      this.alertService.show("Error", error.message);
    }); 
  }

  navigateHome() {
    this.router.navigate(['/tabs/home']);
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  get displayName(): string {
    return this.authService.displayName;
  }

  get photoURL(): string {
    return this.authService.photoURL;
  }

  get isLoggedIn(): boolean {
    return this.authService.user != null;
  }
}
