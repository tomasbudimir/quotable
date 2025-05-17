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

  async uploadToCloudinary(image: File): Promise<string> {
    try {
      const imageData = new FormData();
      imageData.append('file', image);
      imageData.append('upload_preset', environment.cloudinary.uploadPreset);
      //imageData.append('public_id', imageId);

      // Make POST request to Cloudinary
      const res = await firstValueFrom(this.http.post<any>(environment.cloudinary.uploadUrl, imageData));
      return res.secure_url; // URL of the uploaded image
    } catch (error) {
      this.alertService.show("Error", error.message);
      return '';
    }
  }

  // async uploadToImgur(image: File, deleteHash: string): Promise<ImgurResponse> {
  //   const formData = new FormData();
  //   formData.append('image', image);

  //   const response = await fetch(environment.imgur.imgurAPI, {
  //     method: 'POST',
  //     headers: {
  //       Authorization: `Client-ID ${environment.imgur.clientID}`
  //     },
  //     body: formData
  //   });

  //   const data = await response.json();

  //   if (data.success) {
  //     console.log('Image URL:', data.data.link); // ✅ this is the image URL

  //     await this.deleteOldFile(deleteHash);

  //     return { imageURL: data.data.link, deleteHash: data.data.deletehash } as ImgurResponse;
  //   } else {
  //     console.error('Upload failed:', data);
  //     throw new Error("Failed to upload photo!");
  //   }
  // }

  // async deleteOldFile(deleteHash: string) {
  //   if (deleteHash) {
  //     const res = await fetch(`${environment.imgur.imgurAPI}/${deleteHash}`, {
  //       method: "DELETE",
  //       headers: {
  //         Authorization: `Client-ID ${environment.imgur.clientID}`
  //       }
  //     });
  //   }
  // }
}
