import { Component, OnInit } from '@angular/core';
import { IonButton, IonIcon } from "@ionic/angular/standalone";

@Component({
  selector: 'app-dashboard-recommended-assessment-card',
  templateUrl: './dashboard-recommended-assessment-card.component.html',
  styleUrls: ['./dashboard-recommended-assessment-card.component.scss'],
  standalone: true,
  imports: [IonIcon, IonButton, ]
})
export class DashboardRecommendedAssessmentCardComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
