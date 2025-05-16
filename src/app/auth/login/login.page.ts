import { ImageItem } from './../../models/image-item';
import { FileService } from './../../services/file.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { DataService } from '../../services/data.service';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage {
  username = '';
  password = '';
  randomlySelectedImage: ImageItem = null;

  constructor(private authService: AuthService,
    private dataService: DataService,
    private alertService: AlertService,
    private router: Router,
    private fileService: FileService,
    private loadingController: LoadingController
  ) { }

  ionViewDidEnter() {
    this.loadImages();
  }

  async loadImages() {
    try {
      const imageItems = await this.fileService.getImageItems();  
      
      if (imageItems.length > 0) {
        const index = Math.floor(Math.random() * imageItems.length);
        this.randomlySelectedImage = imageItems[index];
      }
    } catch (error) {
      console.error(error.message);
    }
  }

  async login() {
    const loading = await this.loadingController.create();
    await loading.present();

    try {
      const res = await this.authService.login(this.username, this.password);

      if (!res.user.emailVerified) {
        await this.authService.logout();
        this.alertService.show("E-mail not verified yet", "Please verify your e-mail address before you can log in!")
      } else {
        this.dataService.setLoggedInDate(res.user.uid);
        this.router.navigateByUrl('/tabs', { replaceUrl: true });
      }
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

  goToRegister() {
    this.router.navigateByUrl('/register', { replaceUrl: true });
  }
}
