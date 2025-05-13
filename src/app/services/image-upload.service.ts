import { environment } from './../../environments/environment.prod';
import { AlertService } from './alert.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageUploadService {

  constructor(private http: HttpClient, private alertService: AlertService) { }

  async save(image: File, imageId: string): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('file', image);
      formData.append('upload_preset', environment.cloudinary.uploadPreset);
      formData.append('public_id', imageId);

      // Make POST request to Cloudinary
      const res = await firstValueFrom(this.http.post<any>(environment.cloudinary.uploadUrl, formData));
      return res.secure_url; // URL of the uploaded image
    } catch (error) {
      this.alertService.show("Error", error.message);
      return '';
    }
  }
}
