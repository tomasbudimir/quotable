import { AlertService } from './../../services/alert.service';
import { LoadingController } from '@ionic/angular';
import { ImageItem } from './../../models/image-item';
import { FileService } from './../../services/file.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-new-quote',
  templateUrl: './new-quote.page.html',
  styleUrls: ['./new-quote.page.scss'],
  standalone: false
})
export class NewQuotePage {
  imageItems: ImageItem[];

  constructor(private fileService: FileService,
    private loadingController: LoadingController,
    private alertService: AlertService
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

}
