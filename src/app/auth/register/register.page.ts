import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { sendEmailVerification } from '@angular/fire/auth';
import { AuthService } from '../../services/auth.service';
import { DataService } from '../../services/data.service';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false
})
export class RegisterPage {
  name = '';
  username = '';
  password = '';

  constructor(private authService: AuthService, 
    private alertService: AlertService,
    private router: Router,
    private dataService: DataService,
    private loadingController: LoadingController
  ) { }

  async register() {
    const loading = await this.loadingController.create();
    await loading.present();

    try {
      const res = await this.authService.register(this.username, this.password);

      this.authService.updateDisplayName(this.name);
      this.dataService.setUser(res.user.uid, res.user.email, this.name);
      this.dataService.setDateUserJoined(res.user.uid);

      await sendEmailVerification(res.user);
      await this.authService.logout();
      this.alertService.show("Verify e-mail", "Please open your e-mail and verify link");
      this.router.navigateByUrl('/login', { replaceUrl: true });
    } catch (error) {
      this.alertService.show("Error", error.message);
    } finally {
      await loading.dismiss();
    }
  }

  async googleSignIn() {
    try {
      const res = await this.authService.loginWithGoogle();

      this.dataService.setUser(res.user.uid, res.user.email, res.user.displayName);
      this.dataService.setPhotoURL(res.user.uid, res.user.photoURL);
      this.dataService.setLoggedInDate(res.user.uid);
      this.dataService.setDateUserJoined(res.user.uid);

      this.router.navigate(['/tabs']);
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

      this.router.navigate(['/tabs']);
    } catch (error) {
      this.alertService.show("Error", error.message);
    }
  }

  goToLogin() {
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }
}
