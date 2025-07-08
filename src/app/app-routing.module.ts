import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AlreadyLoggedInGuard } from './services/already-logged-in.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'tabs',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./auth/login/login.module').then(m => m.LoginPageModule),
    canActivate: [AlreadyLoggedInGuard]
  },
  {
    path: 'modal-login',
    loadChildren: () => import('./auth/modal-login/modal-login.module').then(m => m.ModalLoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./auth/register/register.module').then(m => m.RegisterPageModule),
    canActivate: [AlreadyLoggedInGuard]
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule),
  },
  {
    path: 'one-quote/:id',
    loadChildren: () => import('./one-quote/one-quote.module').then(m => m.OneQuotePageModule)
  },
  {
    path: 'authors',
    loadChildren: () => import('./authors/authors.module').then(m => m.AuthorsPageModule)
  },
  {
    path: '**',
    redirectTo: 'tabs',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
