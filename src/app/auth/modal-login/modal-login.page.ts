import { Router } from '@angular/router';
import { AuthService } from './../../services/auth.service';
import { DataService } from './../../services/data.service';
import { AlertService } from './../../services/alert.service';
import { ModalController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-modal-login',
  templateUrl: './modal-login.page.html',
  styleUrls: ['./modal-login.page.scss'],
  standalone: false
})
export class ModalLoginPage {

  constructor(private modalController: ModalController,
    private router: Router,
    private authService: AuthService,
    private dataService: DataService,
    private alertService: AlertService) { }

  async googleSignIn() {
    try {
      const res = await this.authService.loginWithGoogle();

      this.dataService.setUser(res.user.uid, res.user.email, res.user.displayName);
      this.dataService.setPhotoURL(res.user.uid, res.user.photoURL);
      this.dataService.setLoggedInDate(res.user.uid);
      this.dataService.setDateUserJoined(res.user.uid);

      this.modalController.dismiss();
      this.afterSignIn();
    } catch (error) {
      this.alertService.show("Error", error.message);
    }
  }

  async facebookSignIn() {
    try {
      const res = await this.authService.loginWithFacebook();

      this.dataService.setUser(res.user.uid, res.user.email, res.user.displayName);
      this.dataService.setPhotoURL(res.user.uid, res.user.photoURL);
      this.dataService.setLoggedInDate(res.user.uid);
      this.dataService.setDateUserJoined(res.user.uid);

      this.modalController.dismiss();
      this.afterSignIn();
    } catch (error) {
      this.alertService.show("Error", error.message);
    }
  }

  signInByEmail() {
    this.modalController.dismiss();
    this.router.navigateByUrl('/login');
  }

  afterSignIn() {
    this.alertService.showToast('Great! You can like or post quotes now.', 'thumbs-up-outline');
    this.router.navigate(['/tabs']);
  }
}
