import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonInput } from '@ionic/angular/standalone';
import { TopbarComponent } from 'src/app/components/topbar/topbar.component';
import { BackButtonComponent } from 'src/app/back-button/back-button.component';
import { UxButtonComponent } from 'src/app/submodules/angular-ux-button/standalone/ux-button.component';
import { EditAddForm } from 'src/app/utils/edit-add-form';
import { ChipInputComponent } from 'src/app/components/chip-input/chip-input.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ContentService } from 'src/app/services/content.service';
import { TranslateService } from '@ngx-translate/core';
import { I18nPipeShortened } from 'src/app/i18n.pipe';
import { displayErrors } from 'src/app/utils/display-errors';
import { catchError, finalize, throwError } from 'rxjs';
import { Candidate, WorkExperienceEntity } from 'src/app/models/Candidate';

@Component({
  selector: 'app-work-experience-form',
  templateUrl: './work-experience-form.page.html',
  styleUrls: ['./work-experience-form.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, TopbarComponent, ReactiveFormsModule, BackButtonComponent,
    IonButton, IonInput, UxButtonComponent, ChipInputComponent, I18nPipeShortened
  ]
})
export class WorkExperienceFormPage extends EditAddForm<WorkExperienceEntity> implements OnInit {
  form:FormGroup = new FormGroup({
    companyName: new FormControl('', [Validators.required]),
    jobTitle: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    employmentType: new FormControl('', [Validators.required]),
    workType: new FormControl('', [Validators.required]),
    startDate: new FormControl('', [Validators.required]),
    endDate: new FormControl('', [Validators.required]),
    responsibilitiesAndAchievements: new FormControl('', [Validators.required]),
    location: new FormControl('', [Validators.required]),
  })
  displayedError:{[key:string]:string|undefined} = {
    companyName: undefined,
    jobTitle: undefined,
    description: undefined,
    employmentType: undefined,
    workType: undefined,
    startDate: undefined,
    endDate: undefined,
    responsibilitiesAndAchievements: undefined,
    location: undefined,
  }
  protected override propertyAccessor: (c: Candidate) => any[] = (c)=>c.workExperienceEntities
  protected override prepareFormData = (we: WorkExperienceEntity) => {
    return {
      ...we,
      // Convert startDate to yyyy-mm-dd
      startDate: we.startDate.split("T")[0],
      endDate: we.endDate?.split("T")[0]
    }
  }
  protected override extractFormData = (we: WorkExperienceEntity) => {
    return {
      ...we,
      startDate: new Date(we.startDate).toISOString(),
      endDate: we.endDate ? new Date(we.endDate).toISOString() : null
    } as WorkExperienceEntity
  }
  constructor(
    route: ActivatedRoute,
    translate: TranslateService,
    cdr: ChangeDetectorRef,
    cs: ContentService,
    router: Router
  ) {
    super(
      route, translate, cdr, cs, router
    )
  }

  async ngOnInit() {
    await this.initialize() // From the parent class
  }

  override submit(){
    // Mark form as touched
    console.log(this.form.value)
    this.form.markAllAsTouched()
    if (this.form.invalid){
      displayErrors(this.form, this.displayedError, (v)=>this.translate.instant(v))
      this.cdr.detectChanges()
      return;
    }
    this.formIsLoading = true


    if (this.formMode == 'add'){ // Not yet tested
      let data = [this.extractFormData(this.form.value)]
      this.cs.post_exp(`/api/v1/self-candidate/${this.candidate.candidateId}/add-work-experience`, data, {})
      .pipe(catchError((error)=>{
        // TODO, this pipe should be reused
        // The code below actually doesn't work
        if (error.error.status == 400){ // Token invalid
          this.router.navigate(["/login"])
        }
        return throwError(error)
      }), finalize(()=>{this.formIsLoading = false;}))
      .subscribe(async (response:WorkExperienceEntity[])=>{
        // await this.cs.candidateData.set(response); // Update cached data
        let candidate:Candidate = await this.cs.candidateData.get() as any;
        candidate.workExperienceEntities = candidate.workExperienceEntities.concat(response);
        await this.cs.candidateData.set(candidate);
        this.cs.candidateDataSubject.next(candidate); // Patch the candidate data
        this.router.navigate(["/work-experience"])
      })
    } else if (this.formMode == 'edit'){
      let data = this.extractFormData(this.form.value)
      // Why use V1 here ??
      this.cs.put_exp(`/api/v1/self-candidate/${this.candidate.candidateId}/update-work-experience/${this.entityId}`, data, {})
      .pipe(catchError((error)=>{
        // TODO, this pipe should be reused
        // The code below actually doesn't work
        if (error.error.status == 400){ // Token invalid
          this.router.navigate(["/login"])
        }
        return throwError(error)
      }), finalize(()=>{this.formIsLoading = false;}))
      .subscribe(async (response:WorkExperienceEntity)=>{
        let candidate:Candidate = await this.cs.candidateData.get() as any;
        let index = candidate.workExperienceEntities.findIndex((v)=>v.id == response.id);
        candidate.workExperienceEntities[index] = response;
        await this.cs.candidateData.set(candidate);
        this.cs.candidateDataSubject.next(candidate); // Patch the candidate data
        this.router.navigate(["/work-experience"])
      })
    }
  }
}