import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewQuotePage } from './new-quote.page';

const routes: Routes = [
  {
    path: '',
    component: NewQuotePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewQuotePageRoutingModule {}
