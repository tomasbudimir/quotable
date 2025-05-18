import { FontSizeService } from './../../services/font-size.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../../services/alert.service';
import { LoadingController } from '@ionic/angular';
import { ImageItem } from '../../models/image-item';
import { FileService } from '../../services/file.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-quote',
  templateUrl: './quote.page.html',
  styleUrls: ['./quote.page.scss'],
  standalone: false
})
export class QuotePage {
  imageItems: ImageItem[];
  imageItemSelected: ImageItem = null;

  quoteId: string = null;
  quoteText: string = null;
  quotedBy: string = null;

  isPreview: boolean = false;

  constructor(private fileService: FileService,
    private loadingController: LoadingController,
    private alertService: AlertService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private fontSizeService: FontSizeService
  ) { }

  ionViewDidEnter() {
    this.quoteId = this.activatedRoute.snapshot.paramMap.get('id');

    if (this.quoteId) {
      // TODO get it from firebase
      this.imageItemSelected = { url: "/assets/images/climb.jpg" } as ImageItem;
    } else {
      this.loadImages();
    }
  }
  
  get fontSize(): number {
    return this.fontSizeService.getFontSize(this.quoteText);
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

  backgroundSelected(imageItem: ImageItem) {
    this.imageItemSelected = imageItem;
  }

  async selectBackgroundAgain() {
    if (!this.imageItems) {
      await this.loadImages();
    }
    
    this.imageItemSelected = null;
  }

  async cancel() {
    const result = await this.alertService.confirm('Confirm', 'Are you sure you want to cancel?');

    if (result) {
      this.imageItemSelected = null;
      this.isPreview = false;
      this.router.navigate(['/tabs/home']);
    }
  }

  preview() {
    this.isPreview = true;
  }

  goBackFromPreview() {
    this.isPreview = false;
  }

  publish() {

  }
}
