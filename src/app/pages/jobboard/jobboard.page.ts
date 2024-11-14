import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonSearchbar } from '@ionic/angular/standalone';
import { TopbarComponent } from 'src/app/components/topbar/topbar.component';
import { JobCardComponent } from 'src/app/components/job-card/job-card.component';
import { TopbarDashboardComponent } from 'src/app/topbar-dashboard/topbar-dashboard.component';
import { BottomNavbarComponent } from 'src/app/components/bottom-navbar/bottom-navbar.component';
import { FilterChipsComponent } from 'src/app/components/filter-chips/filter-chips.component';
import { Router } from '@angular/router';
import { BottomNavbarTarget } from 'src/app/utils/bottom-navbar-target';
import { ContentService } from 'src/app/services/content.service';
import { JobInvitationEntity, PaginedJobInvitationArray } from 'src/app/models/Candidate';
import { TranslateService } from '@ngx-translate/core';
import { ProfileDataService } from 'src/app/services/profile-data.service';
@Component({
  selector: 'app-jobboard',
  templateUrl: './jobboard.page.html',
  styleUrls: ['./jobboard.page.scss'],
  standalone: true,
  imports: [IonSearchbar, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, TopbarComponent, JobCardComponent, TopbarDashboardComponent,
    BottomNavbarComponent, FilterChipsComponent, ReactiveFormsModule
  ]
})
export class JobboardPage extends BottomNavbarTarget implements OnInit {
  chipControl = new FormControl<string|null>(null)
  invitationEntities:JobInvitationEntity[] = []
  displayedInvitationEntities:JobInvitationEntity[] = [] // Since we have a filter option

  // the language
  lang: "en"|"fr" = "en"
  
  constructor(
    public translate: TranslateService,
    router: Router,
    private cs: ContentService,
    private cdr: ChangeDetectorRef,
    private pds: ProfileDataService
  ) { 
    super(router)
    this.lang = (this.translate.currentLang.includes("fr") ? "fr" : "en") as "en"|"fr"
  }

  ngOnInit() {
    setTimeout(()=>{
      this.chipControl.patchValue("all")
    }, 1000)

    // CAUTION, the pagined data should be managed carefully
    this.pds.onJobInvitationsData(true, true)
      .subscribe((data:JobInvitationEntity[])=>{
        console.log("Invitation data", data)
        this.invitationEntities = data
        this.displayedInvitationEntities = this._filterDisplayed(this.invitationEntities)
      })

    // Testing, will be deleted
    /*this.cs.get_exp(`/api/v1/job/get-all`, {})
      .subscribe((data:any)=>{
        console.log(data)
      })*/

    // Testing 2, job by users
    /*this.cs.get_exp(`/api/v1/job/invited-job-list-by-user`, {})
      .subscribe((data:PaginedJobInvitationArray)=>{
        this.invitationEntities = data.content
        console.log(this.invitationEntities)
        this.displayedInvitationEntities = this._filterDisplayed(this.invitationEntities)
      })*/
  }

  private _filterDisplayed(invitationEntities:JobInvitationEntity[]):JobInvitationEntity[]{
    // filters will be applied here
    return invitationEntities
  }

}
