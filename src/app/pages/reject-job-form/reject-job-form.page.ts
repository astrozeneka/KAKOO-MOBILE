import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { TopbarComponent } from 'src/app/components/topbar/topbar.component';
import { BackButtonComponent } from 'src/app/back-button/back-button.component';
import { OutlineInputComponent } from 'src/app/components/outline-input/outline-input.component';
import { UxButtonComponent } from 'src/app/submodules/angular-ux-button/standalone/ux-button.component';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ContentService } from 'src/app/services/content.service';
import { displayErrors } from 'src/app/utils/display-errors';
import { Candidate, JobEntity, JobInvitationEntity } from 'src/app/models/Candidate';
import { EJobEntity } from '../job-detail/job-detail.page';
import { catchError, finalize, map, mergeMap, Observable } from 'rxjs';
import { ProfileDataService } from 'src/app/services/profile-data.service';
import { I18nPipeShortened } from 'src/app/i18n.pipe';
import { Location } from '@angular/common';
import { environment } from 'src/environments/environment';
import { FeedbackService } from 'src/app/services/feedback.service';

@Component({
  selector: 'app-reject-job-form',
  templateUrl: './reject-job-form.page.html',
  styleUrls: ['./reject-job-form.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, TopbarComponent, BackButtonComponent,
    ReactiveFormsModule, FormsModule, OutlineInputComponent, UxButtonComponent, I18nPipeShortened
  ]
})
export class RejectJobFormPage implements OnInit {
  // Variables (same as in reject-job)
  candidate: Candidate = null as any;
  jobId:number
  jobEntity:EJobEntity|null = null

  form:FormGroup = new FormGroup({
    candidate_note: new FormControl<string|null>(null, [Validators.required])
  })
  displayedError:{[key:string]:string|undefined} = {
    candidate_note: undefined
  }
  formIsLoading: boolean = false
  lang: "en"|"fr" = "en" // Might be unused

  constructor(
    protected cs: ContentService,
    private router: Router,
    private translate: TranslateService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private pds: ProfileDataService,
    private location: Location,
    private fs: FeedbackService
  ) { 
    this.lang = (this.translate.currentLang.includes("fr") ? "fr" : "en") as "en"|"fr"
    this.jobId= parseInt(this.route.snapshot.paramMap.get('jobId')!);
  }

  ngOnInit() {
    // Load job data (together with the related JobInvitationEntity)
    this._loadJob(this.jobId)
    .subscribe((job:EJobEntity) => {
      this.jobEntity = job
      // Load the corresponding inviteStataus
      this.pds.onJobInvitationsData(true, true)
      .subscribe((data:JobInvitationEntity[])=>{
        let jobInvitationEntity = data.find((ji:JobInvitationEntity) => ji.jobEntity.jobId === this.jobId)
        if (this.jobEntity)
          this.jobEntity.jobInvitationEntity = jobInvitationEntity
        console.log(this.jobEntity)
      })
    })

    // Load candidate data
    this.cs.registerCandidateDataObserverV3(true, false) // Only from cache
      .subscribe((candidate: Candidate|null) => {
        if (!candidate) console.log("Candidate data is not available, should disconnect the user")
        this.candidate = candidate!
      })
  }

  /**
   * Exactly the same as in employer-questions
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

  submit(){
    // Mark form as touched
    this.form.markAllAsTouched()
    if (this.form.invalid){
      displayErrors(this.form, this.displayedError, (v)=>this.translate.instant(v))
      this.cdr.detectChanges()
      return;
    }
    this.formIsLoading = true
    
    // Submit to the url (get classic parameters, not json)
    this.cs.post_exp_fullurl(
      `${environment.apiEndpoint}/api/v1/job/reject-job/job-id/${this.jobId}/candidate-id/${this.jobEntity?.jobInvitationEntity?.candidateIdHr}?candidate_note=${encodeURIComponent(this.form.value.candidate_note)}`
    , {}, {})
      .pipe(catchError((error)=>{
        console.log(error)
        throw error;
      }), finalize(()=>{ this.formIsLoading = false }))
      .subscribe(async (res:any)=>{
        // The response
        console.log(res)
        // TODO, feedback service
        await this.fs.register({
          message: this.translate.instant("The job has been rejected"),
          color: "dark",
          type: "toast",
          position: "top",
          positionAnchor: 'header'
        })
        this.router.navigateByUrl(`/job-detail/${this.jobId}`, {replaceUrl:true})
      })
  }

}
