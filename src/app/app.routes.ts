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
  {
    path: 'personal-information',
    loadComponent: () => import('./pages/personal-information/personal-information.page').then( m => m.PersonalInformationPage)
  },
  {
    path: 'add-skills',
    loadComponent: () => import('./pages/add-skills/add-skills.page').then( m => m.AddSkillsPage)
  },
  {
    path: 'education-and-certification',
    loadComponent: () => import('./pages/education-and-certification/education-and-certification.page').then( m => m.EducationAndCertificationPage)
  },
  {
    path: 'work-experience',
    loadComponent: () => import('./pages/work-experience/work-experience.page').then( m => m.WorkExperiencePage)
  },
  {
    path: 'projects',
    loadComponent: () => import('./pages/projects/projects.page').then( m => m.ProjectsPage)
  },
  {
    path: 'job-preferences',
    loadComponent: () => import('./pages/job-preferences/job-preferences.page').then( m => m.JobPreferencesPage)
  },
  {
    path: 'social-accounts',
    loadComponent: () => import('./pages/social-accounts/social-accounts.page').then( m => m.SocialAccountsPage)
  },
  {
    path: 'terms-and-conditions',
    loadComponent: () => import('./pages/terms-and-conditions/terms-and-conditions.page').then( m => m.TermsAndConditionsPage)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.page').then( m => m.DashboardPage)
  },
  {
    path: 'jobboard',
    loadComponent: () => import('./pages/jobboard/jobboard.page').then( m => m.JobboardPage)
  },
  {
    path: 'job-detail',
    loadComponent: () => import('./pages/job-detail/job-detail.page').then( m => m.JobDetailPage)
  },
  {
    path: 'employer-questions',
    loadComponent: () => import('./pages/employer-questions/employer-questions.page').then( m => m.EmployerQuestionsPage)
  },
  {
    path: 'meetings',
    loadComponent: () => import('./pages/meetings/meetings.page').then( m => m.MeetingsPage)
  },
  {
    path: 'refferals',
    loadComponent: () => import('./pages/refferals/refferals.page').then( m => m.RefferalsPage)
  },
  {
    path: 'edit-and-preview-profile',
    loadComponent: () => import('./pages/edit-and-preview-profile/edit-and-preview-profile.page').then( m => m.EditAndPreviewProfilePage)
  },
  {
    path: 'support',
    loadComponent: () => import('./pages/support/support.page').then( m => m.SupportPage)
  },
  {
    path: 'job-preferences',
    loadComponent: () => import('./pages/job-preferences/job-preferences.page').then( m => m.JobPreferencesPage)
  },
  {
    path: 'meeting-overview',
    loadComponent: () => import('./pages/meeting-overview/meeting-overview.page').then( m => m.MeetingOverviewPage)
  },
  {
    path: 'success',
    loadComponent: () => import('./pages/success/success.page').then( m => m.SuccessPage)
  },
];
