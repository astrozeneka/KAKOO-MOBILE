import { Component, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { Preferences } from '@capacitor/preferences';
import { HttpClientModule, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { AppLanguageService } from './services/app-language.service';
import { IntentPlugin } from './capacitor-plugins/intent.plugin'; // Should be loaded in the main app component

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [
    IonApp, 
    IonRouterOutlet
  ],
})
export class AppComponent implements OnInit {
  prefDark = window.matchMedia('(prefers-color-scheme: dark)');
  constructor(
    private translate: TranslateService,
    private appLanguageService: AppLanguageService
  ) {
    Preferences.set({
      key: 'mode',
      value: this.prefDark.matches ? 'light' : 'dark',
    })
  }

  ngOnInit(): void {
    // TODO, non valid token will be redirected to login page
    
  }
}
