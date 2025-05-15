import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ImageItem } from '../models/image-item';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private http: HttpClient) {}

  getImageItems(): Promise<ImageItem[]> {
    return firstValueFrom(this.http.get<ImageItem[]>('/assets/images.json'));
  }
}
