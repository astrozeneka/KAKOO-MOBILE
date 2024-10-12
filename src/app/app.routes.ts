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
    loadComponent: () => import('./pages/splash-2/splash-2.page').then( m => m.Splash2Page)
  },
  {
    path: 'signup',
    loadComponent: () => import('./pages/signup/signup.page').then( m => m.SignupPage)
  },
  {
    path: 'reset-password',
    loadComponent: () => import('./pages/reset-password/reset-password.page').then( m => m.ResetPasswordPage)
  },
  {
    path: 'check-your-email',
    loadComponent: () => import('./pages/check-your-email/check-your-email.page').then( m => m.CheckYourEmailPage)
  },
  {
    path: 'create-password',
    loadComponent: () => import('./pages/create-password/create-password.page').then( m => m.CreatePasswordPage)
  },
  {
    path: 'welcome',
    loadComponent: () => import('./pages/welcome/welcome.page').then( m => m.WelcomePage)
  },
];
