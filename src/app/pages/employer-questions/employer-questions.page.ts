import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonTextarea, IonButton, IonIcon } from '@ionic/angular/standalone';
import { FileCardComponent } from 'src/app/components/file-card/file-card.component';
import { TopbarComponent } from 'src/app/components/topbar/topbar.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ContentService } from 'src/app/services/content.service';
import { Candidate, JobEntity, JobInvitationEntity } from 'src/app/models/Candidate';
import { UxButtonComponent } from 'src/app/submodules/angular-ux-button/standalone/ux-button.component';
import { EJobEntity } from '../job-detail/job-detail.page';
import { TranslateService } from '@ngx-translate/core';
import { ProfileDataService } from 'src/app/services/profile-data.service';
import { Feedback, FeedbackService } from 'src/app/services/feedback.service';
import { catchError, filter, finalize, map, mergeMap, Observable } from 'rxjs';
import { I18nPipeShortened } from 'src/app/i18n.pipe';
import { Location } from '@angular/common';
import { displayErrors } from 'src/app/utils/display-errors';
import { environment } from 'src/environments/environment';
import { OutlineTextareaComponent } from "../../components/outline-textarea/outline-textarea.component";

@Component({
  selector: 'app-employer-questions',
  templateUrl: './employer-questions.page.html',
  styleUrls: ['./employer-questions.page.scss'],
  standalone: true,
  imports: [IonIcon, IonButton, IonTextarea, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, FileCardComponent, TopbarComponent,
    ReactiveFormsModule, UxButtonComponent, I18nPipeShortened, OutlineTextareaComponent]
})
export class EmployerQuestionsPage implements OnInit {
  // Variables (same as in reject-job)
  candidate: Candidate = null as any;
  jobId:number
  jobEntity:EJobEntity|null = null


  form:FormGroup = new FormGroup({
    coverLater: new FormControl<string|null>(null, [])
    // Additionnal controls for custom questions will be here
  })
  displayedError:{[key:string]:string|undefined} = {
    coverLater: undefined
    // Additionnal fields for custom questions will be here
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
    public location: Location,
    private fs: FeedbackService
  ) { 
    this.lang = (this.translate.currentLang.includes("fr") ? "fr" : "en") as "en"|"fr"
    this.jobId= parseInt(this.route.snapshot.paramMap.get('jobId')!);
  }

  ngOnInit() {
    // Load job data (together with the related JobInvitationEntity)
    // exactly the same as in JobInvitationEntity
    /*this._loadJob(this.jobId)
    .subscribe((job:EJobEntity) => {
      this.jobEntity = job
      // Load the corresponding inviteStataus
      this.pds.onJobInvitationsData(true, true)
      .subscribe((data:JobInvitationEntity[])=>{
        let jobInvitationEntity = data.find((ji:JobInvitationEntity) => ji.jobEntity.jobId === this.jobId)
        if (this.jobEntity)
          this.jobEntity.jobInvitationEntity = jobInvitationEntity
        // Set the customQuentities form controls
        this.jobEntity?.jobCustomQuestionEntities?.forEach((jq) => {
          this.form.addControl(`customQuestion_${jq.jobCustomQuestionId}`, new FormControl<string|null>("", [Validators.required]))
          this.displayedError[`customQuestion_${jq.jobCustomQuestionId}`] = undefined
        })
      })
    })*/

    this.pds.onJobInvitationsData(true, false) // Use from cache only
     .pipe(
        map((data:JobInvitationEntity[]) => {
          return data.find((ji:JobInvitationEntity) => ji.jobEntity.jobId === this.jobId)
        }),
        filter((jobInvitationEntity:JobInvitationEntity|undefined) => jobInvitationEntity != undefined),
        map((jobInvitationEntity:JobInvitationEntity|undefined) => {
          return {
            ...jobInvitationEntity?.jobEntity,
            jobInvitationEntity: {...jobInvitationEntity, companyEntity: null/*, jobEntity: null as any*/},
            companyEntity: null as any // Don' need the company here
          } as EJobEntity
        })
      )
      .subscribe((jobEntity:EJobEntity)=>{
        this.jobEntity = jobEntity
        // Set the customQuentities form controls
        this.jobEntity?.jobCustomQuestionEntities?.forEach((jq) => {
          this.form.addControl(`customQuestion_${jq.jobCustomQuestionId}`, new FormControl<string|null>("", [Validators.required]))
          this.displayedError[`customQuestion_${jq.jobCustomQuestionId}`] = undefined
        })
      })
  }

  /**
   * Exactly the same as in reject-job-form
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
      console.log(this.displayedError)
      this.cdr.detectChanges()
      return;
    }

    // Prepare the data
    let data = {
      coverLater: this.form.get('coverLater')?.value,
      cultureFitAnswerEntities: [],
      jobCustomAnswerEntities: [] as any,
      prescreeningAnswerEntities: [] as any
    }
    Object.entries(this.form.value).forEach(([k, v]) => {
      if (k.startsWith("customQuestion_")){
        let jqId = parseInt(k.replace("customQuestion_", ""))
        let jqEntity = this.jobEntity?.jobCustomQuestionEntities?.find((jq) => jq.jobCustomQuestionId === jqId)
        if (jqEntity){
          data.jobCustomAnswerEntities.push({
            candidateId: null,
            jobCustomAnswerId: null,
            jobId: this.jobId,
            name: v, // The value
            jobCustomQuestionEntity: jqEntity
          } as any)
        } else {
          console.error("Custom question not found with id = "+ jqId)
        }
      }
    })

    console.log(data)
    // Submit
    this.formIsLoading = true
    this.cs.post_exp_fullurl(`${environment.apiEndpoint}/api/v1/job/accept-job/job-id/${this.jobId}/candidate-id/${this.jobEntity?.jobInvitationEntity?.candidateIdHr}`, data, {})
      .pipe(
        catchError((error)=>{ console.log(error); throw error; }), 
        finalize(()=>{ this.formIsLoading = false })
      )
      .subscribe(async (res:any)=>{
        // The response
        console.log(res)
        /*this.fs.register({
          message: this.translate.instant("The job invitation has been accepted"),
          color: "primary",
          type: "toast",
          position: "top",
          positionAnchor: 'header'
        })*/
        this.fs.register({
          message: this.translate.instant("Job Application Sent Successfully"),
          type: 'application-sent',
          subtitle: "Your job application has successfully uploaded. Best of luck!",
          buttonText: "Back to Job Board",
          buttonLink: "/jobboard"
        } as Feedback)
        this.location.back()  
      })


    this.formIsLoading = true
  }
}
