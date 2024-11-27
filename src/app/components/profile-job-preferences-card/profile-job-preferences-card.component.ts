import { Component, Input, OnInit } from '@angular/core';
import { Candidate, MobilityEntity } from 'src/app/models/Candidate';
import { IonSpinner } from "@ionic/angular/standalone";
import { ProfileUtilsService } from 'src/app/services/profile-utils.service';
import { I18nPipeShortened } from 'src/app/i18n.pipe';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-profile-job-preferences-card',
  templateUrl: './profile-job-preferences-card.component.html',
  styleUrls: ['./profile-job-preferences-card.component.scss'],
  standalone: true,
  imports: [IonSpinner, I18nPipeShortened]
})
export class ProfileJobPreferencesCardComponent  implements OnInit {
  @Input() candidate: Candidate|null = null

  // the language
  lang: "en"|"fr" = "en"
  
  mobilityKeyAccessor: (e:MobilityEntity) => string = (option: MobilityEntity) =>
    (this.lang=="fr" ? option.name : option.name) // !!! CAUTION, the DTO is buggy

  constructor(
    public pus:ProfileUtilsService,
    public translate: TranslateService,
  ) { 
    this.lang = (this.translate.currentLang.includes("fr") ? "fr" : "en") as "en"|"fr"
  }

  ngOnInit() {}
  
  ngOnChanges() {
    console.log(this.candidate?.selfCandidateMobilityEntities)
  }

}
