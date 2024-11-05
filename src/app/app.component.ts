import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { Preferences } from '@capacitor/preferences';
import { HttpClientModule, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { AppLanguageService } from './services/app-language.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [
    IonApp, 
    IonRouterOutlet
  ],
})
export class AppComponent {
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
}
