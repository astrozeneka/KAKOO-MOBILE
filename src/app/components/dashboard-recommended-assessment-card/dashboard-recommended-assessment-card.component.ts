import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonButton, IonIcon } from "@ionic/angular/standalone";
import { CandidateAssessmentEntity } from 'src/app/models/Candidate';

@Component({
  selector: 'app-dashboard-recommended-assessment-card',
  templateUrl: './dashboard-recommended-assessment-card.component.html',
  styleUrls: ['./dashboard-recommended-assessment-card.component.scss'],
  standalone: true,
  imports: [IonIcon, IonButton, DatePipe, RouterModule]
})
export class DashboardRecommendedAssessmentCardComponent  implements OnInit {
  @Input() assessmentEntity: CandidateAssessmentEntity|null = null
  @Input() variant: 'default' = 'default'
  routerLink: string|null = null

  constructor() { }

  ngOnInit() {}

}
