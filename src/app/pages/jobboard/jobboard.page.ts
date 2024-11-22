import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonSearchbar } from '@ionic/angular/standalone';
import { TopbarComponent } from 'src/app/components/topbar/topbar.component';
import { JobCardComponent } from 'src/app/components/job-card/job-card.component';
import { TopbarDashboardComponent } from 'src/app/topbar-dashboard/topbar-dashboard.component';
import { BottomNavbarComponent } from 'src/app/components/bottom-navbar/bottom-navbar.component';
import { FilterChipsComponent } from 'src/app/components/filter-chips/filter-chips.component';
import { NavigationEnd, Router, RouterEvent } from '@angular/router';
import { BottomNavbarTarget } from 'src/app/utils/bottom-navbar-target';
import { ContentService } from 'src/app/services/content.service';
import { Displayable, JobInvitationEntity, PaginedJobInvitationArray } from 'src/app/models/Candidate';
import { TranslateService } from '@ngx-translate/core';
import { ProfileDataService } from 'src/app/services/profile-data.service';
import { ClickableJobCardComponent } from 'src/app/components/clickable-job-card/clickable-job-card.component';
import { BehaviorSubject, filter, Observable, switchMap } from 'rxjs';

export type DisplayableJobInvitationEntity = JobInvitationEntity & Displayable

@Component({
  selector: 'app-jobboard',
  templateUrl: './jobboard.page.html',
  styleUrls: ['./jobboard.page.scss'],
  standalone: true,
  imports: [IonSearchbar, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, TopbarComponent, JobCardComponent, TopbarDashboardComponent,
    BottomNavbarComponent, FilterChipsComponent, ReactiveFormsModule, ClickableJobCardComponent
  ]
})
export class JobboardPage extends BottomNavbarTarget implements OnInit, AfterViewInit {
  chipControl = new FormControl<'saved'|'applied'|'all'|'rejected'|'pending'|null>(null) // Saved is now unused
  invitationEntities:JobInvitationEntity[] = []
  displayedInvitationEntities:JobInvitationEntity[] = [] // Since we have a filter option

  // the language
  lang: "en"|"fr" = "en"

  // Experimental features (an alternative to the StoredArray) [SHOULD USE Displayable[] in the future]
  processDisplayable = (entities:DisplayableJobInvitationEntity[], existingDisplayables:DisplayableJobInvitationEntity[])=>{
    return entities.map((entity:DisplayableJobInvitationEntity)=>{
      const existingDisplayable = existingDisplayables.find((displayable)=>displayable.id === entity.id)
      const subject = existingDisplayable?.subject || new BehaviorSubject<JobInvitationEntity>(entity)
      return {
        ...entity,
        subject,
        $: subject.asObservable()
      }
    })
  }
  
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
    // Load job data from controller
    this.router.events
      .pipe(
        filter(e=>e instanceof NavigationEnd),
        switchMap(()=>this.pds.onJobInvitationsData(true, true))
      )
      .subscribe((data:JobInvitationEntity[])=>{
        // Patched the data
        this.invitationEntities = this.processDisplayable(data, this.invitationEntities)
        this.displayedInvitationEntities = this._filterDisplayed(this.invitationEntities)
      })
    
    // Handle the chip value change
    this.chipControl.valueChanges.subscribe((val)=>{
      this.displayedInvitationEntities = this._filterDisplayed(this.invitationEntities)
    })
  }

  ngAfterViewInit(): void {
    this.chipControl.patchValue("all")
  }

  private _filterDisplayed(invitationEntities:JobInvitationEntity[]):JobInvitationEntity[]{
    let filterValue = this.chipControl.value
    // filter the list using the criteria
    if (filterValue === "all") return invitationEntities
    if (filterValue === "applied") return invitationEntities.filter((entity)=>entity.inviteStatus === "ACCEPTED")
    if (filterValue === "rejected") return invitationEntities.filter((entity)=>entity.inviteStatus === "REJECTED")
    if (filterValue === "pending") return invitationEntities.filter((entity)=>entity.inviteStatus === "PENDING")

    return invitationEntities
  }

}
function switchmMap(arg0: () => Observable<JobInvitationEntity[]>): import("rxjs").OperatorFunction<NavigationEnd, unknown> {
  throw new Error('Function not implemented.');
}

