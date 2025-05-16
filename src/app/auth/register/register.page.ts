import { FileService } from './../../services/file.service';
import { ImageItem } from './../../models/image-item';
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
  randomlySelectedImage: ImageItem = null;
  
  constructor(private authService: AuthService, 
    private alertService: AlertService,
    private router: Router,
    private dataService: DataService,
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

  goToLogin() {
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }
}
