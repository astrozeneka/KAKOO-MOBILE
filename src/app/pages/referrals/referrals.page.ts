import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon } from '@ionic/angular/standalone';
import { ReferralCardComponent } from "../../components/referral-card/referral-card.component";
import { ReferalInputComponent } from 'src/app/components/referal-input/referal-input.component';
import { TopbarDashboardComponent } from 'src/app/topbar-dashboard/topbar-dashboard.component';
import { BottomNavbarComponent } from 'src/app/components/bottom-navbar/bottom-navbar.component';
import { Router } from '@angular/router';
import { BottomNavbarTarget } from 'src/app/utils/bottom-navbar-target';

@Component({
  selector: 'app-referrals',
  templateUrl: './referrals.page.html',
  styleUrls: ['./referrals.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, ReferralCardComponent,
    ReferalInputComponent, IonButton, IonIcon, TopbarDashboardComponent, BottomNavbarComponent
  ]
})
export class ReferralsPage extends BottomNavbarTarget implements OnInit {
  
  constructor(
    router: Router
  ) { 
    super(router)
  }

  ngOnInit() {
  }

}
