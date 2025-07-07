import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
      },
      {
        path: 'home/:view',
        loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
      },
      {
        path: 'one-quote',
        loadChildren: () => import('./one-quote/one-quote.module').then(m => m.OneQuotePageModule)
      },
      {
        path: 'quote',
        loadChildren: () => import('./quote/quote.module').then(m => m.QuotePageModule)
      },
      {
        path: 'quote/:id',
        loadChildren: () => import('./quote/quote.module').then(m => m.QuotePageModule)
      },
      {
        path: 'profile',
        loadChildren: () => import('./profile/profile.module').then(m => m.ProfilePageModule)
      },
    ]
  },
  {
    path: 'one-quote',
    loadChildren: () => import('../one-quote/one-quote.module').then( m => m.OneQuotePageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
