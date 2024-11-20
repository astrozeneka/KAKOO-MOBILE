import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon, IonSpinner } from '@ionic/angular/standalone';
import { TopbarComponent } from "../../components/topbar/topbar.component";
import { BackButtonComponent } from 'src/app/back-button/back-button.component';
import { JobDetailsRequirementsTableComponent } from "../../components/job-details-requirements-table/job-details-requirements-table.component";
import { EmployerQuestionsPage } from "../employer-questions/employer-questions.page";
import { JobDetailsEmployerQuestionsComponent } from "../../components/job-details-employer-questions/job-details-employer-questions.component";
import { HorizontalScrollableTabsComponent } from "../../components/horizontal-scrollable-tabs/horizontal-scrollable-tabs.component";
import { JobDetailsHeaderComponent } from 'src/app/components/job-details-header/job-details-header.component';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ContentService } from 'src/app/services/content.service';
import { CompanyEntity, JobEntity, JobInvitationEntity } from 'src/app/models/Candidate';
import { finalize, map, mergeMap, Observable } from 'rxjs';
import { ProfileDataService } from 'src/app/services/profile-data.service';

// Experimental (might be moved to Candidate.ts in a near future)
export interface EJobEntity extends JobEntity {
  companyEntity: CompanyEntity
  jobInvitationEntity?: JobInvitationEntity
}

@Component({
  selector: 'app-job-detail',
  templateUrl: './job-detail.page.html',
  styleUrls: ['./job-detail.page.scss'],
  standalone: true,
  imports: [IonSpinner, IonIcon, IonButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, TopbarComponent, BackButtonComponent, JobDetailsRequirementsTableComponent, EmployerQuestionsPage, JobDetailsEmployerQuestionsComponent, HorizontalScrollableTabsComponent,
    JobDetailsHeaderComponent, RouterModule
  ]
})
export class JobDetailPage implements OnInit {

  jobId:number
  jobEntity:EJobEntity|null = null
  isPageLoading: boolean = false // For an improved ui
  
  // 1. The element related to the dynamical scroll
  @ViewChild('description') description!: ElementRef;
  @ViewChild('jobRequirements') jobRequirements!: ElementRef;
  @ViewChild('responsibilities') responsibilities!: ElementRef;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private cs: ContentService,
    private pds: ProfileDataService,
    private cdr: ChangeDetectorRef
  ) {
    this.jobId = parseInt(this.route.snapshot.paramMap.get('jobId')!);
  }

  ngOnInit() {
    /**
     * is to load the jobinvitation entity together
     */

    this.isPageLoading = true;
    this.jobId = parseInt(this.route.snapshot.paramMap.get('jobId')!);
    this._loadJob(this.jobId)
      .subscribe((job:EJobEntity) => {
        this.jobEntity = job
      })
    
    // Load the corresponding inviteStataus
    this.pds.onJobInvitationsData(true, true)
      .subscribe((data:JobInvitationEntity[])=>{
        let jobInvitationEntity = data.find((ji:JobInvitationEntity) => ji.jobEntity.jobId === this.jobId)
        if (this.jobEntity)
          this.jobEntity.jobInvitationEntity = jobInvitationEntity
        this.cdr.detectChanges()
      })
  }

  /**
   * The below cde should use the advanced-caching system (for performance and user experience)
   */
  private _loadJob(jobId:number):Observable<EJobEntity>{
    return this.cs.get_exp(`/api/v1/job/job-id/${jobId}`, {})
      .pipe(mergeMap((job:JobEntity) => 
        this.cs.get_exp(`/api/v1/candidate/get-company/${job.companyId}`, {})
          .pipe(map((companyEntity: any) => {
            return {...job, companyEntity} as EJobEntity
          }))
      ))
  }

  goToSection(section:string|Event){
    let element = {
      'description': this.description,
      'jobRequirements': this.jobRequirements,
      'responsibilities': this.responsibilities
    }[section as string]?.nativeElement
    const offset = 20;
    const elementPosition = element?.getBoundingClientRect().top + window.scrollY;
    const offsetPosition = elementPosition - offset;
    /*window.scrollTo({
      top: offsetPosition,
      behavior: "smooth"
    })*/
    // The above code should update the window configuration
    // https://stackoverflow.com/questions/1174863/javascript-scrollto-method-does-nothing
    element?.scrollIntoView({behavior: 'smooth', block: 'start', inline: 'nearest'});
  }

}
