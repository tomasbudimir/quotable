import { ModalLoginPage } from './../../auth/modal-login/modal-login.page';
import { ModalController } from '@ionic/angular';
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
  @Input() isPostQuoteDisplayed: boolean = true;

  constructor(private authService: AuthService,
    private router: Router,
    private modalController: ModalController,
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

  async post() {
    if (this.authService.user == null) {
      const result = await this.alertService.confirm('Posting a quote requires sign-in', 'Do you want to sign in? It is free.');

      if (result) {
        const modal = await this.modalController.create({
          component: ModalLoginPage,
          breakpoints: [0, 0.5, 0.8],
          initialBreakpoint: 0.5
        });

        modal.present();
      }
    } else {
      this.router.navigate(['/tabs', 'quote']);
    }
  }

  getToProfile() {
    this.router.navigate(['tabs', 'profile']);
  }
}
