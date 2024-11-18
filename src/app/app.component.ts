import { Component, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { Preferences } from '@capacitor/preferences';
import { HttpClientModule, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { AppLanguageService } from './services/app-language.service';
import { IntentPlugin } from './capacitor-plugins/intent.plugin'; // Should be loaded in the main app component
import { BottomNavbarUtilsService } from './services/bottom-navbar-utils.service';
import { BottomNavbarComponent } from './components/bottom-navbar/bottom-navbar.component';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [
    IonApp, 
    IonRouterOutlet,
    BottomNavbarComponent
  ],
})
export class AppComponent implements OnInit {
  prefDark = window.matchMedia('(prefers-color-scheme: dark)');
  constructor(
    private translate: TranslateService,
    private appLanguageService: AppLanguageService,
    public bnus: BottomNavbarUtilsService,
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
