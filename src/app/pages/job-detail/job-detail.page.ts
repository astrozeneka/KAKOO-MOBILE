import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon } from '@ionic/angular/standalone';
import { TopbarComponent } from "../../components/topbar/topbar.component";
import { BackButtonComponent } from 'src/app/back-button/back-button.component';
import { JobDetailsRequirementsTableComponent } from "../../components/job-details-requirements-table/job-details-requirements-table.component";
import { EmployerQuestionsPage } from "../employer-questions/employer-questions.page";
import { JobDetailsEmployerQuestionsComponent } from "../../components/job-details-employer-questions/job-details-employer-questions.component";
import { HorizontalScrollableTabsComponent } from "../../components/horizontal-scrollable-tabs/horizontal-scrollable-tabs.component";
import { JobDetailsHeaderComponent } from 'src/app/components/job-details-header/job-details-header.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ContentService } from 'src/app/services/content.service';
import { CompanyEntity, JobEntity } from 'src/app/models/Candidate';
import { map, mergeMap, Observable } from 'rxjs';

// Experimental (might be moved to Candidate.ts in a near future)
export interface EJobEntity extends JobEntity {
  companyEntity: CompanyEntity
}

@Component({
  selector: 'app-job-detail',
  templateUrl: './job-detail.page.html',
  styleUrls: ['./job-detail.page.scss'],
  standalone: true,
  imports: [IonIcon, IonButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, TopbarComponent, BackButtonComponent, JobDetailsRequirementsTableComponent, EmployerQuestionsPage, JobDetailsEmployerQuestionsComponent, HorizontalScrollableTabsComponent,
    JobDetailsHeaderComponent
  ]
})
export class JobDetailPage implements OnInit {

  jobId:number
  jobEntity:EJobEntity|null = null
  
  // 1. The element related to the dynamical scroll
  @ViewChild('description') description!: ElementRef;
  @ViewChild('jobRequirements') jobRequirements!: ElementRef;
  @ViewChild('responsibilities') responsibilities!: ElementRef;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private cs: ContentService
  ) {
    this.jobId = parseInt(this.route.snapshot.paramMap.get('jobId')!);
  }

  ngOnInit() {
    this.jobId = parseInt(this.route.snapshot.paramMap.get('jobId')!);
    this._loadJob(this.jobId)
      .subscribe((job:EJobEntity) => {
        this.jobEntity = job
      })
  }

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
