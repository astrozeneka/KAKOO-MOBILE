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
import { finalize } from 'rxjs';

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

  
  constructor(
    public translate: TranslateService,
    router: Router,
    private cs: ContentService
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
    
  }

}
