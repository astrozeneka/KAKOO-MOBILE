import { Component, Input, OnInit } from '@angular/core';
import { Candidate, CityEntity, CountryEntity, LanguageEntity } from 'src/app/models/Candidate';
import { IonSpinner } from "@ionic/angular/standalone";
import { TranslateService } from '@ngx-translate/core';
import { SvgProfileComponent } from 'src/app/svg-profile/svg-profile.component';
import { ProfileUtilsService } from 'src/app/services/profile-utils.service';

@Component({
  selector: 'app-profile-basic-details-card',
  templateUrl: './profile-basic-details-card.component.html',
  styleUrls: ['./profile-basic-details-card.component.scss'],
  standalone: true,
  imports: [IonSpinner, SvgProfileComponent]
})
export class ProfileBasicDetailsCardComponent  implements OnInit {
  @Input() candidate: Candidate|null = null;
  // Languages
  lang: "en"|"fr" = "en"
  // Location
  cityKeyAccessor = (city: CityEntity|undefined) => city?.name;
  countryKeyAccessor = (country: CountryEntity|undefined) => country?.name;
  // Spoken Languages (Is actually available from the PUS)
  languageOptionsKeyAccessor = (language: LanguageEntity):string =>
    this.lang == "en" ? language.name : (language.nameFr||language.name) as string
  
  constructor(
    private translate: TranslateService
  ) { 
    this.lang = (this.translate.currentLang.includes("fr") ? "fr" : "en") as "en"|"fr"
  }

  ngOnInit() {
  }

}
