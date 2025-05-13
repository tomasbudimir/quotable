import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UploaderPageRoutingModule } from './uploader-routing.module';

import { UploaderPage } from './uploader.page';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UploaderPageRoutingModule,
    SharedModule
  ],
  declarations: [UploaderPage]
})
export class UploaderPageModule {}
