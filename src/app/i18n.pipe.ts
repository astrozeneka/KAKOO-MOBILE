import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'i18n',
  standalone: true
})
export class I18nPipe implements PipeTransform {
  private translated: string = '';

  constructor(private translate: TranslateService) {
    // Sample feature, set language to french
    /*this.translate.setDefaultLang('fr');
    this.translate.use('fr').subscribe(()=>{});*/
  }

  transform(value: string, ...args: unknown[]): string {
    return this.translate.instant(value as string);
  }
}

// An alias pipe
@Pipe({
  name: '_',
  standalone: true
})
export class I18nPipeShortened extends I18nPipe {}
