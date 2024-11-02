import { Component, OnInit } from '@angular/core';
import { IonButton, IonIcon } from "@ionic/angular/standalone";

@Component({
  selector: 'app-dashboard-recommended-job-card',
  templateUrl: './dashboard-recommended-job-card.component.html',
  styleUrls: ['./dashboard-recommended-job-card.component.scss'],
  standalone: true,
  imports: [IonButton, IonIcon]
})
export class DashboardRecommendedJobCardComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
