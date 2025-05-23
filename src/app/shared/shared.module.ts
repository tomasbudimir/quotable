import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { HeaderComponent } from './header/header.component';
import { QuoteComponent } from './quote/quote.component';

@NgModule({
  declarations: [
    HeaderComponent,
    QuoteComponent
  ],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [
    HeaderComponent,
    QuoteComponent
  ]
})
export class SharedModule { }
