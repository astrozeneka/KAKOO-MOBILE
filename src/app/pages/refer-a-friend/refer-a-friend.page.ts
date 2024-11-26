import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonButton, IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonText, IonInput, IonItem, IonIcon } from '@ionic/angular/standalone';
import { ReferalInputComponent } from 'src/app/components/referal-input/referal-input.component';
import { TopbarComponent } from 'src/app/components/topbar/topbar.component';
import { BackButtonComponent } from 'src/app/back-button/back-button.component';
import { User } from 'src/app/models/User';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { ContentService } from 'src/app/services/content.service';
import { environment } from 'src/environments/environment';
import {Clipboard} from "@capacitor/clipboard";
import { FeedbackService } from 'src/app/services/feedback.service';
import Intent from 'src/app/capacitor-plugins/intent.plugin';
import { I18nPipeShortened } from 'src/app/i18n.pipe';

@Component({
  selector: 'app-refer-a-friend',
  templateUrl: './refer-a-friend.page.html',
  styleUrls: ['./refer-a-friend.page.scss'],
  standalone: true,
  imports: [IonIcon, IonItem, IonButton, IonInput, IonText, IonButtons, IonBackButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,
    ReferalInputComponent, TopbarComponent, BackButtonComponent, I18nPipeShortened
  ]
})
export class ReferAFriendPage implements OnInit {

  user: User|null = null
  referralLink: string = ''
  lang: "en"|"fr" = "en"
  dataIsLoading: boolean = false
  
  constructor(
    public translate: TranslateService,
    router: Router,
    private cs: ContentService,
    private fs: FeedbackService
  ) { 
    this.lang = (this.translate.currentLang.includes("fr") ? "fr" : "en") as "en"|"fr"
  }

  ngOnInit() {
    this.dataIsLoading = true

    this.cs.registerUserDataObserver(true, true)
      .subscribe(user => {
        this.user = user
        this.referralLink = `https://${environment.serverHost}/candidate/signup?ref=${user?.myReferralCode}&lang=${this.lang}`
      })
  }

  async copyToClipboard() {
    await Clipboard.write({
      string: this.referralLink
    })
    console.log("Copied to clipboard")
    this.fs.registerNow({
      message: this.translate.instant(this.translate.instant("Link copied to clipboard")),
      color: 'dark',
      type: 'toast',
      position: 'bottom'
    })
  }

  async shareLink(){
    let res = await Intent.displayShareSheet({message: this.referralLink, intentTitle: this.translate.instant("Share via"), subject: this.translate.instant("Referral link")})
    console.log(res)
  }

}
