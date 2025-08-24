import { AuthService } from './../../services/auth.service';
import { DataService } from './../../services/data.service';
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

  isPrivate: boolean = false;
  isPreview: boolean = false;

  constructor(private fileService: FileService,
    private loadingController: LoadingController,
    private alertService: AlertService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private dataService: DataService,
    private authService: AuthService,
    private fontSizeService: FontSizeService
  ) { }

  get fontSize(): number {
    return this.fontSizeService.getFontSize(this.quoteText);
  }

  ionViewDidEnter() {
    this.quoteId = this.activatedRoute.snapshot.paramMap.get('id');

    if (this.quoteId) {
      this.dataService.getQuoteById(this.quoteId).subscribe(res => {
        if (res) {
          this.imageItemSelected = { url: res.url } as ImageItem;
          this.quoteText = res.quoteText;
          this.quotedBy = res.quotedBy;
          this.isPrivate = res?.isPrivate ?? false;
        } else {
          this.loadImages();
        }
      });
    } else {
      this.loadImages();
    }
  }

  async selectBackgroundAgain() {
    if (!this.imageItems) {
      await this.loadImages();
    }
    
    this.imageItemSelected = null;
  }

  async loadImages() {
    const loading = await this.loadingController.create();
    await loading.present();

    try {
      this.imageItems = await this.fileService.getImageItems(); 
      this.doRandomImageSelect();
    } catch (error) {
      this.alertService.show("Error", error.message);
    } finally {
      await loading.dismiss();
    }
  }

  async doRandomImageSelect() {
    if (!this.imageItems) {
      await this.loadImages();
    }

    const index = Math.floor(Math.random() * this.imageItems.length);
    this.backgroundSelected(this.imageItems[index]);
  }

  backgroundSelected(imageItem: ImageItem) {
    this.imageItemSelected = imageItem;
  }

  async cancel() {
    const result = await this.alertService.confirm('Confirm', 'Are you sure you want to cancel?');

    if (result) {
      this.resetInput();
      this.router.navigate(['/tabs/home']);
    }
  }

  preview() {
    if(!this.quoteText?.trim().length) {
      this.alertService.show('Info', 'Please specify the text of the quote first!');
      return;
    }

    this.isPreview = true;

    if (!this.quotedBy) {
      // If User did not attribute the quote to anyone
      this.quotedBy = this.authService.displayName;
    }
  }

  goBackFromPreview() {
    this.isPreview = false;
  }

  async publish() {
    const loading = await this.loadingController.create();
    await loading.present();

    try {
      if (this.quoteId) {
        // Updating existing quote
        await this.dataService.updateQuote(this.quoteId, this.quoteText.trim(), this.quotedBy.trim(), this.imageItemSelected.url, this.isPrivate);
      } else {
        // Creating a new quote
        await this.dataService.createQuote(this.quoteText.trim(), this.quotedBy.trim(), this.imageItemSelected.url, this.isPrivate);
      }

      this.resetInput();
      
      this.router.navigate(['/tabs', 'home']);
    } catch (error) {
      this.alertService.show("Error", error.message);
    } finally {
      await loading.dismiss();
    }
  }

  resetInput() {
    this.imageItemSelected = null;
    this.isPreview = false;
    this.quoteId = null;
    this.quoteText = null;
    this.quotedBy = null;
  }
};
