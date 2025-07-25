import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AuthorsPageRoutingModule } from './authors-routing.module';

import { AuthorsPage } from './authors.page';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AuthorsPageRoutingModule,
    SharedModule
  ],
  declarations: [AuthorsPage]
})
export class AuthorsPageModule {}
