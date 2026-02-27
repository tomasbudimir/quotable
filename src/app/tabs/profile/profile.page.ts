import { ImageUploadService } from '../../services/image-upload.service';
import { AuthService } from '../../services/auth.service';
import { DataService } from '../../services/data.service';
import { Component } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: false
})
export class ProfilePage {
  imageFile: File | null = null;
  photoURL: string;
  displayName: string;
  email: string;
  saveButtonEnabled: boolean;

  constructor(private imageUploadService: ImageUploadService,
    private authService: AuthService,
    private dataService: DataService,
    private alertService: AlertService,
    private loadingController: LoadingController) { }

  ionViewDidEnter() {
    this.saveButtonEnabled = false;
    this.displayName = this.authService.displayName;
    this.photoURL = this.authService.photoURL;
    this.email = this.authService.email;
  }

  userMadeChange() {
    this.saveButtonEnabled = true;
  }

  onFileSelected(event) {
    if (event.target.files) {
      const files = event.target.files;
      this.imageFile = files[0];
      this.photoURL = URL.createObjectURL(this.imageFile);
      this.saveButtonEnabled = true;
    }
  }

  async save() {
    const loading = await this.loadingController.create();
    await loading.present();

    try {
      if (this.imageFile) {
        this.photoURL = await this.imageUploadService.uploadToCloudinary(this.imageFile);

        this.authService.updatePhotoURL(this.photoURL);
        this.dataService.setPhotoURL(this.authService.user.uid, this.photoURL);
      }
    
      this.authService.updateDisplayName(this.displayName);
      this.dataService.setUser(this.authService.user.uid, this.authService.user.email, this.displayName);
    } catch (error) {
      this.alertService.show("Error", error.message);
    } finally {
      await loading.dismiss();
    }
  }
}
