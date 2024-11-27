import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton } from '@ionic/angular/standalone';
import { LanguageSelectorControlComponent } from "../../components/language-selector-control/language-selector-control.component";
import { ActivatedRoute, Router } from '@angular/router';
import { ContentService } from 'src/app/services/content.service';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { AppLanguageService } from 'src/app/services/app-language.service';
import { Location } from '@angular/common';
import { I18nPipeShortened } from 'src/app/i18n.pipe';

@Component({
  selector: 'app-language-selector-1',
  templateUrl: './language-selector-1.page.html',
  styleUrls: ['./language-selector-1.page.scss'],
  standalone: true,
  imports: [IonButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, LanguageSelectorControlComponent, ReactiveFormsModule, I18nPipeShortened]
})
export class LanguageSelector1Page implements OnInit {
  form: FormGroup = new FormGroup({
    "language": new FormControl('en')
  });
  displayedError: {[key:string]:string|undefined} = { // Unused
    "language": undefined
  }
  formIsLoading: boolean = false // Unused

  constructor(
    private router:Router,
    private cs: ContentService,
    public translate: TranslateService,
    private httpClient: HttpClient,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private als: AppLanguageService,
    private location: Location
  ) { }

  async ngOnInit() {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
    this.router.onSameUrlNavigation = 'reload';
    this.form.patchValue({
      "language": await this.als.languageStorage.get() || 'en'
    })
    console.log(this.form.value)
    this.form.valueChanges.subscribe((value) => {
      // Set language
      let language = value.language;
      this.als.languageStorage.set(language);
      this.translate.use(language).subscribe(()=>{
        // window.location.reload();
      })
    })
  }

  submit(){
    this.router.navigate(['/splash-2'])
  }

}
