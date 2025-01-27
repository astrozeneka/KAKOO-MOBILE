import { Injectable, OnInit } from '@angular/core';
import StoredData from '../submodules/stored-data/StoredData';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage-angular';
import { ContentService } from './content.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AppLanguageService {
  public languageStorage:StoredData<string>;

  constructor(
    private contentService: ContentService,
    private translate: TranslateService,
    private storage: Storage,
    private router: Router
  ) {
    this.languageStorage = new StoredData("language", storage);
    this.languageStorage.get().then(v=>{
      if (!v){
        console.debug("Language not set yet")
        if (environment.defaultLanguageSelection === 'prompt'){
          this.router.navigate(['/language-selector-1']);
        } else if (environment.defaultLanguageSelection === 'system'){
          this.languageStorage.set(navigator.language === 'fr-FR' ? 'fr' : 'en');
        }
      } else {
        console.debug("Language " + v + " detected")
      }
      this.contentService.languageShortened = v === 'fr-FR' ? 'fr' : 'en';
    });
    /*
    (async ()=>{

    })();
    if (!this.languageStorage.get()){
      console.debug("Language not set yet")
      this.languageStorage.set(navigator.language);
    }else{
      console.debug("Set language is " + this.languageStorage.get())
    }
    */
  }
}
