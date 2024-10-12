import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'i18n',
  standalone: true
})
export class I18nPipe implements PipeTransform {
  constructor(private translate: TranslateService) {}

  transform(value: unknown, ...args: unknown[]): unknown {


    // Sample feature, set language to french
    this.translate.setDefaultLang('fr');
    this.translate.use('fr');
    return this.translate.instant(value as string);
  }

}
