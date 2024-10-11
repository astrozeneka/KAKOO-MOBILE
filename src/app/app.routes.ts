import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'contact-us',
    loadComponent: () => import('./pages/contact-us/contact-us.page').then( m => m.ContactUsPage)
  },
  {
    path: 'refer-a-friend',
    loadComponent: () => import('./pages/refer-a-friend/refer-a-friend.page').then( m => m.ReferAFriendPage)
  },
  {
    path: 'language-selector-1',
    loadComponent: () => import('./pages/language-selector-1/language-selector-1.page').then( m => m.LanguageSelector1Page)
  },
  {
    path: 'splash-2',
    loadComponent: () => import('./splash-2/splash-2.page').then( m => m.Splash2Page)
  },
];
