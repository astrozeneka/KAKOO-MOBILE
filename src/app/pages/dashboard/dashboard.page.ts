import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { DashboardCardComponent } from "../../components/dashboard-card/dashboard-card.component";
import { DashboardRecommendedJobCardComponent } from "../../components/dashboard-recommended-job-card/dashboard-recommended-job-card.component";
import { DashboardRecommendedAssessmentCardComponent } from "../../components/dashboard-recommended-assessment-card/dashboard-recommended-assessment-card.component";
import { DashboardInterviewCtaComponent } from "../../components/dashboard-interview-cta/dashboard-interview-cta.component";
import { BottomNavbarComponent } from 'src/app/components/bottom-navbar/bottom-navbar.component';
import { TopbarComponent } from 'src/app/components/topbar/topbar.component';
import { ProfileCtaComponent } from 'src/app/components/profile-cta/profile-cta.component';
import { SectionHeadingComponent } from 'src/app/components/section-heading/section-heading.component';
import { ButtonGroupItemComponent } from 'src/app/components/button-group-item/button-group-item.component';
import { BottomNavbarTarget } from 'src/app/utils/bottom-navbar-target';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, DashboardCardComponent, DashboardRecommendedJobCardComponent, DashboardRecommendedAssessmentCardComponent, DashboardInterviewCtaComponent,
    BottomNavbarComponent, TopbarComponent, ProfileCtaComponent, SectionHeadingComponent, ButtonGroupItemComponent
  ]
})
export class DashboardPage extends BottomNavbarTarget implements OnInit {

  constructor(
    router: Router
  ) { 
    super(router)
  }

  ngOnInit() {
  }

}
