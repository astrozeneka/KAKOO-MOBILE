import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonButton } from "@ionic/angular/standalone";
import { ClickableDashboardCardComponent } from '../components/clickable-dashboard-card/clickable-dashboard-card.component';
import { ClickableSvgProfileComponent } from "../components/clickable-svg-profile/clickable-svg-profile.component";
import { ContentService } from '../services/content.service';

@Component({
  selector: 'app-topbar-dashboard',
  templateUrl: './topbar-dashboard.component.html',
  styleUrls: ['./topbar-dashboard.component.scss'],
  standalone: true,
  imports: [IonButton, RouterModule, ClickableDashboardCardComponent, ClickableSvgProfileComponent, RouterModule]
})
export class TopbarDashboardComponent  implements OnInit {
  initials: string|null = null;

  constructor(
    private cs: ContentService,
  ) { }

  ngOnInit() {
    // 1. Load candidate data in order to get initials (svg picture)
    this.cs.registerCandidateDataObserverV3(true, false)
      .subscribe(candidate=>{
        if (candidate)
          this.initials = candidate!.firstName[0] + candidate!.lastName[0];
        else
          console.warn("Candidate data shouldn't be null");
      })
  }

}
