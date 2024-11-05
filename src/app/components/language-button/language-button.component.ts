import { Location } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonButton, IonIcon } from '@ionic/angular/standalone';
import { TranslateService } from '@ngx-translate/core';
import { AppLanguageService } from 'src/app/services/app-language.service';

@Component({
  selector: 'app-language-button',
  templateUrl: './language-button.component.html',
  styleUrls: ['./language-button.component.scss'],
  standalone: true,
  imports: [IonButton, IonIcon]
})
export class LanguageButtonComponent  implements OnInit {

  // 1. It will handle the language service by himself (false value is not handled)
  @Input() standaloneBehaviour: true = true

  // 2. listHidden Variable
  listHidden: boolean = true;

  // 3. The language actually used by the system
  activeLanguage: 'en-US'|'fr-FR' = 'en-US';
  activeLanguageDisplay: string = "en"
  activeLanguageFlag: string = "/assets/svg/flag-uk.svg"

  constructor(
    private als: AppLanguageService,
    private translateService: TranslateService,
    private cdr: ChangeDetectorRef,
    private location: Location,
    private router: Router
  ) { }

  ngOnInit() {
    // 3. The active language
    this.activeLanguage = this.als.languageStorage.get() as 'en-US'|'fr-FR';
    this.activeLanguageDisplay = this.activeLanguage === 'en-US' ? 'en' : 'fr';
    this.activeLanguageFlag = this.activeLanguage === 'en-US' ? "/assets/svg/flag-uk.svg" : "/assets/svg/flag-fr.svg";
  }

  toggleList(event:PointerEvent|MouseEvent) {
    /*event.stopPropagation();
    event.preventDefault();*/
    console.log(event)
    this.listHidden = !this.listHidden;
  }

  changeLanguage(event:any, language:'en-US'|'fr-FR') {
    /*event.stopPropagation();
    event.preventDefault();*/

    this.als.languageStorage.set(language);
    this.translateService.use(language);
    this.translateService.use(language).subscribe(()=>{

      window.location.reload() // This will reload the entire webapp
      //console.log(this.translateService.instant('HELLO'))
      //this.cdr.detectChanges();
      // Reload page
      // {onSameUrlNavigation: 'reload'}
      /*this.router.navigate(['/splash-icon'], {
        skipLocationChange: true,
        onSameUrlNavigation: 'reload' // Doesn't work
      }).then((res) => {
        this.router.navigateByUrl(this.location.path(), {
          onSameUrlNavigation: 'reload'
        });
      })*/
    })

    // Redirect to home
  }

}
