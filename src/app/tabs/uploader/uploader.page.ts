import { AuthService } from './../../services/auth.service';
import { DataService } from './../../services/data.service';
import { ImageUploadService } from './../../services/image-upload.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-uploader',
  templateUrl: './uploader.page.html',
  styleUrls: ['./uploader.page.scss'],
  standalone: false
})
export class UploaderPage {

  image: File | null = null;
  imageUrl: string = null;
  description: string;

  constructor(private imageUploadService: ImageUploadService,
    private authService: AuthService,
    private dataService: DataService
  ) { }
  
  fileChanged(event) {
    const files = event.target.files;
    this.image = files[0];
    this.imageUrl = URL.createObjectURL(this.image);
  }

  async save() {
    let photoUrl = '';

    if (this.image) {
      photoUrl = await this.imageUploadService.save(this.image, this.authService.user.uid);
    }
    
    // TODO update user in database
  }
}
