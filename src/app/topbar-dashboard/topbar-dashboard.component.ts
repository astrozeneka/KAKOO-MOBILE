import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonButton } from "@ionic/angular/standalone";

@Component({
  selector: 'app-topbar-dashboard',
  templateUrl: './topbar-dashboard.component.html',
  styleUrls: ['./topbar-dashboard.component.scss'],
  standalone: true,
  imports: [IonButton, RouterModule]
})
export class TopbarDashboardComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
