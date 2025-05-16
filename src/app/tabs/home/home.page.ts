import { AuthService } from './../../services/auth.service';
import { AlertService } from 'src/app/services/alert.service';
import { FileService } from './../../services/file.service';
import { ImageItem } from './../../models/image-item';
import { Component } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false
})
export class HomePage {

  imageItems: ImageItem[];

  constructor(private fileService: FileService,
    private loadingController: LoadingController,
    private alertService: AlertService,
    private authService: AuthService
  ) { }

  ionViewDidEnter() {
    this.loadImages();
  }

  async loadImages() {
    const loading = await this.loadingController.create();
    await loading.present();

    try {
      this.imageItems = await this.fileService.getImageItems();  
    } catch (error) {
      this.alertService.show("Error", error.message);
    } finally {
      await loading.dismiss();
    }
  }

  get isLoggedIn(): boolean {
    return this.authService.user != null;
  }

  get isFacebookLogin(): boolean {
    return this.isLoggedIn && this.authService.user.providerData[0].providerId == 'facebook.com';
  }

  get isMyPost(): boolean {
    return this.isLoggedIn; // TODO add: && ...
  }

  likingQuote() {
    if (this.authService.user == null) {
      this.alertService.show('Login first', 'You must be logged in to like a quote!');
      return;
    }
  }
}
