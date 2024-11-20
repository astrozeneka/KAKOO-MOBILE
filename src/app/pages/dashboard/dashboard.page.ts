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
import { SvgProfileComponent } from "../../svg-profile/svg-profile.component";
import { ContentService } from 'src/app/services/content.service';
import { Candidate, CandidateAssessmentEntity } from 'src/app/models/Candidate';
import { ClickableProfileCtaComponent } from 'src/app/components/clickable-profile-cta/clickable-profile-cta.component';
import { ClickableDashboardCardComponent } from 'src/app/components/clickable-dashboard-card/clickable-dashboard-card.component';
import { I18nPipeShortened } from 'src/app/i18n.pipe';
import { DevDebugButtonComponent } from "../../dev-prod-components/debug-button/dev-debug-button/dev-debug-button.component";
import { ProdDebugButtonComponent } from 'src/app/dev-prod-components/debug-button/prod-debug-button/prod-debug-button.component';
import { environment } from 'src/environments/environment';
import { ProfileDataService } from 'src/app/services/profile-data.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, DashboardCardComponent, DashboardRecommendedJobCardComponent, DashboardRecommendedAssessmentCardComponent, DashboardInterviewCtaComponent,
    BottomNavbarComponent, TopbarComponent, ProfileCtaComponent, SectionHeadingComponent, ButtonGroupItemComponent, SvgProfileComponent, ClickableProfileCtaComponent, ClickableDashboardCardComponent, I18nPipeShortened,
    ...[(environment.production ? ProdDebugButtonComponent : DevDebugButtonComponent)],
  ]
})
export class DashboardPage extends BottomNavbarTarget implements OnInit {

  // The candidate data
  candidate:Candidate|null = null
  candidateAssessmentEntities: CandidateAssessmentEntity[] = []

  constructor(
    router: Router,
    private cs: ContentService,
    private pds: ProfileDataService
  ) { 
    super(router)
  }

  ngOnInit() {
    this.pds.onAssessmentData(true, true).subscribe((data)=>{
      console.log('Assessment data:', data)
      this.candidateAssessmentEntities = data // Only set
    })
  }

}
