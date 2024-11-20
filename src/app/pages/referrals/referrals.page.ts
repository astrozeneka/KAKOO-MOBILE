import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon, IonSpinner } from '@ionic/angular/standalone';
import { ReferralCardComponent } from "../../components/referral-card/referral-card.component";
import { ReferalInputComponent } from 'src/app/components/referal-input/referal-input.component';
import { TopbarDashboardComponent } from 'src/app/topbar-dashboard/topbar-dashboard.component';
import { BottomNavbarComponent } from 'src/app/components/bottom-navbar/bottom-navbar.component';
import { Router } from '@angular/router';
import { BottomNavbarTarget } from 'src/app/utils/bottom-navbar-target';
import { ReferralEntity, User } from 'src/app/models/User';
import { ContentService } from 'src/app/services/content.service';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, finalize } from 'rxjs';
import { ProfileDataService } from 'src/app/services/profile-data.service';
import { Displayable } from 'src/app/models/Candidate';

export type DisplayableRefferalEntity = ReferralEntity & Displayable

@Component({
  selector: 'app-referrals',
  templateUrl: './referrals.page.html',
  styleUrls: ['./referrals.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, ReferralCardComponent,
    ReferalInputComponent, IonButton, IonIcon, TopbarDashboardComponent, BottomNavbarComponent, IonSpinner
  ]
})
export class ReferralsPage extends BottomNavbarTarget implements OnInit {
  
  user: User|null = null
  referralLink: string = ''
  referrals: ReferralEntity[] = []
  lang: "en"|"fr" = "en"
  dataIsLoading: boolean = false

  // Experimental features (an alternative to the StoredArray) [SHOULD USE Displayable[] in the future]
  processDisplayable = (entities:DisplayableRefferalEntity[], existingDisplayables:DisplayableRefferalEntity[])=>{
    return entities.map((referral:DisplayableRefferalEntity)=>{
      const existingDisplayable = existingDisplayables.find((displayable)=>displayable.id === referral.id)
      const subject = existingDisplayable?.subject || new BehaviorSubject<ReferralEntity>(referral)
      return {
        ...referral,
        subject,
        $: subject.asObservable()
      }
    })
  }
  
  constructor(
    public translate: TranslateService,
    router: Router,
    private cs: ContentService,
    private pds: ProfileDataService
  ) { 
    super(router)
    this.lang = (this.translate.currentLang.includes("fr") ? "fr" : "en") as "en"|"fr"
  }

  ngOnInit() {

    // Load user data in order to get referral Link
    // For later, we should use 'caching' to make it load quicker (experimental-advanced-caching)
    this.dataIsLoading = true
    this.cs.registerUserDataObserver(true, true)
      .subscribe(user => {
        this.user = user        
        this.referralLink = `https://${environment.serverHost}/candidate/signup?ref=${user?.myReferralCode}&lang=${this.lang}`
      })
    this.pds.onReferralsData(true, true)
      .subscribe(referrals => {
        this.referrals = this.processDisplayable(referrals, this.referrals)
        this.dataIsLoading = false
      })
    
    
    /*this.cs.registerUserDataObserver(true, true)
      .subscribe(user => {
        this.user = user
        let oldReferralLink = this.referralLink
        this.referralLink = `https://${environment.serverHost}/candidate/signup?ref=${user?.myReferralCode}&lang=${this.lang}`
        if (oldReferralLink != this.referralLink) {
          // Update the referal list
          this.cs.get_exp(`/api/v1/referral-sys/all/referred-list/${user?.myReferralCode}`, {})
            .pipe(finalize(() => this.dataIsLoading = false))
            .subscribe((referrals: {data: ReferralEntity[]}) => {
              this.referrals = referrals.data
              console.log(this.referrals)
            })
        }
      })
    */
    
  }

}
