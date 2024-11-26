import { DatePipe, JsonPipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { IonButton, IonIcon } from "@ionic/angular/standalone";
import { Browser } from '@capacitor/browser';
import { EmploymentTypeEntity, MeetingEntity, WorkTypeEntity } from 'src/app/models/Candidate';
import { I18nPipeShortened } from 'src/app/i18n.pipe';
import { TranslateService } from '@ngx-translate/core';
import { ProfileUtilsService } from 'src/app/services/profile-utils.service';

export interface MeetingV2 {
  financialNegotiationId: number
  jobId: number
  candidateId: number
  toTime: any
  fromTime: any
  timeZone: any
  title: any
  description: any
  thirdPartyEmail: any
  jobTitle: string
  interviewerName: string
  financialNegotiationStatus: string
  guestName: any
  jobType: WorkTypeEntity
  employmentTypeEntity: EmploymentTypeEntity
  meetingLink: any
  creationDate: any
}

@Component({
  selector: 'app-meeting-card',
  templateUrl: './meeting-card.component.html',
  styleUrls: ['./meeting-card.component.scss'],
  standalone: true,
  imports: [IonIcon, IonButton, JsonPipe, I18nPipeShortened, DatePipe]
})
export class MeetingCardComponent  implements OnInit {
  @Input() meeting: MeetingV2 = {} as any

  expanded: boolean = false;
  
  duration: string = ""
  durationUnit: string = ""

  // the language
  lang: "en"|"fr" = "en"

  constructor(
    private translate: TranslateService,
    public pus: ProfileUtilsService
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
