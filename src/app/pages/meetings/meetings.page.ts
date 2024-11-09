import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { MeetingCardComponent } from 'src/app/components/meeting-card/meeting-card.component';
import { TopbarDashboardComponent } from 'src/app/topbar-dashboard/topbar-dashboard.component';
import { BottomNavbarComponent } from 'src/app/components/bottom-navbar/bottom-navbar.component';
import { BottomNavbarTarget } from 'src/app/utils/bottom-navbar-target';
import { Router } from '@angular/router';

@Component({
  selector: 'app-meetings',
  templateUrl: './meetings.page.html',
  styleUrls: ['./meetings.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, MeetingCardComponent,
    TopbarDashboardComponent, BottomNavbarComponent
  ]
})
export class MeetingsPage extends BottomNavbarTarget implements OnInit {

  constructor(
    router: Router
  ) { 
    super(router)
  }

  ngOnInit() {
  }

}
