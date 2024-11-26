import { Component, Input, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonButton, IonIcon } from '@ionic/angular/standalone';
import { I18nPipeShortened } from 'src/app/i18n.pipe';
import { ProfileDataService } from 'src/app/services/profile-data.service';

@Component({
  selector: 'app-clickable-profile-cta',
  templateUrl: './clickable-profile-cta.component.html',
  styleUrls: ['./clickable-profile-cta.component.scss'],
  standalone: true,
  imports: [IonButton, IonIcon, RouterModule, I18nPipeShortened]
})
export class ClickableProfileCtaComponent  implements OnInit {

  @Input() variant: "completed"|"uncompleted" = "uncompleted"
  @Input() routerLink: string|null = null // To be changed
  completeness: number = 0
  
  constructor(
    public pds: ProfileDataService
  ) { }

  ngOnInit() {
    this.pds.onProfileCompletenessPercentageData(false, true)
      .subscribe((d)=>{
        this.completeness = Math.round(d*100)
        if (d == 1) {
          this.variant = "completed"
        } else {
          this.variant = "uncompleted"
        }
      })
  }

}
