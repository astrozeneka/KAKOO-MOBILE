import { Injectable, OnInit } from '@angular/core';
import StoredData from '../submodules/stored-data/StoredData';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class AppLanguageService {
  public languageStorage = new StoredData<string>('language');

  constructor(
    private translate: TranslateService
  ) {
    if (!this.languageStorage.get()){
      console.debug("Language not set yet")
      this.languageStorage.set(navigator.language);
    }else{
      console.debug("Set language is " + this.languageStorage.get())
    }
  }
}
