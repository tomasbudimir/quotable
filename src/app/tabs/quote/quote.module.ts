import { SharedModule } from '../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewQuotePageRoutingModule } from './quote-routing.module';

import { QuotePage } from './quote.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewQuotePageRoutingModule,
    SharedModule
  ],
  declarations: [QuotePage]
})
export class QuotePageModule {}
