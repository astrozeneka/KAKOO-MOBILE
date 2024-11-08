import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonInput } from '@ionic/angular/standalone';
import { TopbarComponent } from 'src/app/components/topbar/topbar.component';
import { BackButtonComponent } from 'src/app/back-button/back-button.component';
import { UxButtonComponent } from 'src/app/submodules/angular-ux-button/standalone/ux-button.component';
import { Candidate, CandidateCertificateEntity } from 'src/app/models/Candidate';
import { EditAddForm } from 'src/app/utils/edit-add-form';
import { ContentService } from 'src/app/services/content.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { I18nPipeShortened } from 'src/app/i18n.pipe';
import { displayErrors } from 'src/app/utils/display-errors';
import { catchError, finalize, throwError } from 'rxjs';

@Component({
  selector: 'app-certification-form',
  templateUrl: './certification-form.page.html',
  styleUrls: ['./certification-form.page.scss'],
  standalone: true,
  imports: [IonButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, TopbarComponent, BackButtonComponent, ReactiveFormsModule,
    UxButtonComponent, I18nPipeShortened, IonInput
  ]
})
export class CertificationFormPage extends EditAddForm<CandidateCertificateEntity> implements OnInit {
  form:FormGroup = new FormGroup({
    // V2
    name: new FormControl('', [Validators.required]),
    institution: new FormControl('', [Validators.required]),
    year: new FormControl('', [Validators.required]),
    // V1
    /*title: new FormControl('', [Validators.required]),
    licenceId: new FormControl('', []),
    issuingOrganization: new FormControl('', [Validators.required]),
    issueDate: new FormControl('', [Validators.required]),
    expireDate: new FormControl('', []),
    licenceURL: new FormControl('', [])*/
  })
  displayedError:{[key:string]:string|undefined} = {
    name: undefined,
    institution: undefined,
    year: undefined
    // V1
    /*title: undefined,
    licenceId: undefined,
    issuingOrganization: undefined,
    issueDate: undefined,
    expireDate: undefined,
    licenceURL: undefined*/
  }
  protected override propertyAccessor: (c:Candidate) => any[] = (c)=>c.candidateCertificateEntities
  protected override prepareFormData = (ce: CandidateCertificateEntity) => {
    return {
      ...ce,
      // The properties below or unused in v2
      // issueDate: ce.issueDate.split("T")[0],  // Not yet tested
      // expireDate: ce.expireDate?.split("T")[0] // Not yet tested
    }
  }
  protected override extractFormData = (ce: CandidateCertificateEntity) => {
    return {
      ...ce,
      // The properties below or unused in v2
      // issueDate: new Date(ce.issueDate).toISOString(), // Not yet tested
      // expireDate: new Date(ce.expireDate).toISOString() // Not yet tested
    } as CandidateCertificateEntity
  }

  constructor(
    route: ActivatedRoute,
    translate: TranslateService,
    cdr: ChangeDetectorRef,
    cs: ContentService,
    router: Router
  ) { 
    super (route, translate, cdr, cs, router)
  }

  async ngOnInit() {
    await this.initialize()
  }

  override submit(){
    // Mark form as touched
    this.form.markAllAsTouched()
    if (this.form.invalid){
      displayErrors(this.form, this.displayedError, (v)=>this.translate.instant(v))
      this.cdr.detectChanges()
      return;
    }
    this.formIsLoading = true

    if (this.formMode == 'add'){
      let data = [
        this.form.value
      ]
      this.cs.post_exp(`/api/v2/self-candidate/${this.candidate.candidateId}/add-certificate`, data, {})
        .pipe(catchError((error)=>{
          // TODO, this pipe should be reused
          // The code below actually doesn't work
          if (error.error.status == 400){ // Token invalid
            this.router.navigate(["/login"])
          }
          return throwError(error)
        }), finalize(()=>{this.formIsLoading = false;}))
        .subscribe(async (response:{code:any, type:any, message:string})=>{
          this.cs.requestCandidateDataRefresh()
          this.router.navigate(["/education-and-certification"])
        })
    } else if (this.formMode == 'edit'){
      let data = this.form.value
      this.cs.post_exp(`/api/v2/self-candidate/${this.candidate.candidateId}/update-certificate/${this.entityId}`, data, {})
        .pipe(catchError((error)=>{
          // TODO, this pipe should be reused
          // The code below actually doesn't work
          if (error.error.status == 400){ // Token invalid
            this.router.navigate(["/login"])
          }
          return throwError(error)
        }), finalize(()=>{this.formIsLoading = false;}))
        .subscribe(async (response:{code:any, type:any, message:string})=>{
          this.cs.requestCandidateDataRefresh()
          // this.router.navigate(["/education-and-certification"]) // to uncomment later
        })

    }
  }

}