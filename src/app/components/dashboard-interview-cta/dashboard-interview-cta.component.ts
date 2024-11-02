import { Component, OnInit } from '@angular/core';
import { IonButton, IonIcon } from "@ionic/angular/standalone";

@Component({
  selector: 'app-dashboard-interview-cta',
  templateUrl: './dashboard-interview-cta.component.html',
  styleUrls: ['./dashboard-interview-cta.component.scss'],
  standalone: true,
  imports: [IonIcon, IonButton]
})
export class DashboardInterviewCtaComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
