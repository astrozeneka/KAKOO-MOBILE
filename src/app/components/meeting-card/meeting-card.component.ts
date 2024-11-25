import { DatePipe, JsonPipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { IonButton, IonIcon } from "@ionic/angular/standalone";
import { Browser } from '@capacitor/browser';
import { MeetingEntity } from 'src/app/models/Candidate';
import { I18nPipeShortened } from 'src/app/i18n.pipe';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-meeting-card',
  templateUrl: './meeting-card.component.html',
  styleUrls: ['./meeting-card.component.scss'],
  standalone: true,
  imports: [IonIcon, IonButton, JsonPipe, I18nPipeShortened, DatePipe]
})
export class MeetingCardComponent  implements OnInit {
  @Input() meeting: MeetingEntity = {} as any

  expanded: boolean = false;
  
  duration: string = ""
  durationUnit: string = ""

  // the language
  lang: "en"|"fr" = "en"

  constructor(
    private translate: TranslateService
  ) { 
    this.lang = (this.translate.currentLang.includes("fr") ? "fr" : "en") as "en"|"fr"
  }

  ngOnInit() {
    let fromTime = new Date(this.meeting.fromTime)
    let toTime = new Date(this.meeting.toTime)

    let nMinutes = Math.floor((toTime.getTime() - fromTime.getTime()) / 60000)
    let nHours = Math.floor(nMinutes / 60)
    if (nHours > 0) {
      this.duration = `${nHours}`
      this.durationUnit = "hrs"
    }
    else {
      this.duration = `${nMinutes}`
      this.durationUnit = "mins"
    }

  }

  toggleExpand() {
    this.expanded = !this.expanded;
  }

  joinMeeting(){
    Browser.open({url: this.meeting.meetingLink})
  }
}
