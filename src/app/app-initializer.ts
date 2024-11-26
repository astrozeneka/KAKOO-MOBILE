import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import { AppLanguageService } from './services/app-language.service';

// Code from ChatGPT
export function appInitializerFactory(translate: TranslateService, als: AppLanguageService) {
  return () => {
    return new Promise(resolve => {
      als.languageStorage.get().then((lang) => {
        translate.use(lang ?? 'en').subscribe(() => {
          resolve(null);
        });
      })
    })
  };
}
