import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { HttpClient, HttpClientModule, provideHttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ThemeDetection } from '@ionic-native/theme-detection/ngx';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { APP_INITIALIZER, importProvidersFrom } from '@angular/core';
import { HttpLoaderFactory } from './app/translation-loader.factory';
import { appInitializerFactory } from './app/app-initializer';
import { AppLanguageService } from './app/services/app-language.service';

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient(),
    FormsModule,
    ReactiveFormsModule,
    ThemeDetection,
    importProvidersFrom(
      HttpClientModule,
      TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      }
    })),
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializerFactory,
      deps: [
        TranslateService,
        AppLanguageService
      ],
      multi: true
    }
  ],
});
