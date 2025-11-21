import { SharedModule } from '../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OneQuotePageRoutingModule } from './one-quote-routing.module';

import { OneQuotePage } from './one-quote.page';
import { ApplyContrastDirective } from '../directives/apply-contrast.directive';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OneQuotePageRoutingModule,
    SharedModule,
    ApplyContrastDirective
  ],
  declarations: [OneQuotePage]
})
export class OneQuotePageModule {}
