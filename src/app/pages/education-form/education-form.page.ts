import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonInput } from '@ionic/angular/standalone';
import { TopbarComponent } from 'src/app/components/topbar/topbar.component';
import { BackButtonComponent } from 'src/app/back-button/back-button.component';
import { I18nPipeShortened } from 'src/app/i18n.pipe';
import { UxButtonComponent } from 'src/app/submodules/angular-ux-button/standalone/ux-button.component';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { displayErrors } from 'src/app/utils/display-errors';
import { ContentService } from 'src/app/services/content.service';
import { Candidate, CandidateCertificateEntity } from 'src/app/models/Candidate';
import { catchError, finalize, throwError } from 'rxjs';
import { EditAddForm } from 'src/app/utils/edit-add-form';
import { catch400Error } from 'src/app/utils/catch400Error';
import { Location } from '@angular/common';
import { YearValidator } from 'src/app/utils/validators';
import { createDeletePrompt } from 'src/app/utils/delete-prompt';
import {AlertController} from "@ionic/angular";
import { OutlineInputComponent } from 'src/app/components/outline-input/outline-input.component';

@Component({
  selector: 'app-education-form',
  templateUrl: './education-form.page.html',
  styleUrls: ['./education-form.page.scss'],
  standalone: true,
  imports: [IonInput, IonButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,
    TopbarComponent, BackButtonComponent, I18nPipeShortened, UxButtonComponent, ReactiveFormsModule,
    OutlineInputComponent
  ]
})
export class EducationFormPage extends EditAddForm<CandidateCertificateEntity> implements OnInit { // Once work-experience-form done, make this extend EditAddForm
  form:FormGroup = new FormGroup({
    college: new FormControl('', [Validators.required]),
    degreeName: new FormControl('', [Validators.required]),
    year: new FormControl('', [Validators.required, YearValidator]),
  })
  displayedError:{[key:string]:string|undefined} = {
    college: undefined,
    degreeName: undefined,
    year: undefined
  }
  protected override propertyAccessor: (c:Candidate) => any[] = (c)=>c.candidateEducationEntities
  protected override prepareFormData = (ce: CandidateCertificateEntity) => {
    return {
      ...ce,
      // TO implement later if needed
    }
  }
  protected override extractFormData = (ce: CandidateCertificateEntity) => {
    return {
      ...ce,
      // To implement later if needed
    }
  }
    

  constructor(
    route: ActivatedRoute,
    translate: TranslateService,
    cdr: ChangeDetectorRef,
    cs: ContentService,
    router: Router,
    private location: Location,
    private alertController: AlertController,
    private t: TranslateService // Injected twice
  ) { 
    super (route, translate, cdr, cs, router)
  }

  async ngOnInit() {
    await this.initialize()
    /*// 1. Load the form mode from the get parameter
    this.formMode = this.route.snapshot.queryParamMap.get("mode") as any || 'add';

    // 2. Load the data from cache
    let extractedData: Candidate|null = await this.cs.candidateData.get();
    this.candidate = extractedData as any;
    if (this.formMode == 'edit'){
      this.entityId = parseInt(this.route.snapshot.queryParamMap.get("id")!) as any;
      let entity = this.candidate.candidateEducationEntities.find((v)=>v.id == this.entityId) as any;
      this.form.patchValue(entity)
    }

    // 3. Data fallback from the server
    this.cs.get_exp(`/api/v2/self-candidate/get-by-id/${this.candidate.candidateId}`, {})
      .pipe(catchError((error)=>{
        // TODO, this pipe should be reused
        if (error.error.status == 400){ // Token invalid
          this.router.navigate(["/login"])
        }
        return throwError(error)
      }))
      .subscribe(async (response)=>{
        // The code below should be reused *** this evening, apply also for education-and-certification page
        this.candidate = response;
        this.cs.candidateData.set(response);
        this.form.patchValue({
          skills: response.skillListEntities.map((skill:any)=>skill.name)
        })
      })
    */
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

    // console.log(this.candidate.candidateId)
    if (this.formMode == 'add'){ // Will be merged into a single method for better maintainability
      let data = [
        this.form.value
      ]
      // Why use v1 here ??
      this.cs.post_exp(`/api/v1/self-candidate/${this.candidate.candidateId}/add-education-certificate`, data, {})
        .pipe(
          catch400Error(this.cs), // Experimental feature
          finalize(()=>{this.formIsLoading = false;}))
        .subscribe(async (response:any)=>{
          let candidate = response; // !!! CAUTION, the data structure retrieved from server is DIFFERENT
          await this.cs.candidateDataSubject.next(candidate); // Patch the candidate data
          await this.cs.candidateData.set(candidate); // Update cached data

          this.location.back()
          // this.router.navigate(["/education-and-certification"], {replaceUrl: true})
        })
    } else if (this.formMode == 'edit'){
      let data = this.form.value
      this.cs.put_exp(`/api/v2/self-candidate/${this.candidate.candidateId}/update-education/${this.entityId}`, data, {})
      .pipe(
        catch400Error(this.cs), // Experimental feature
        finalize(()=>{this.formIsLoading = false;})
      )
      .subscribe(async (response: {code:any, type:any, message:any}|any)=>{
        // !!! CAUTION, the data structure retrieved from server is DIFFERENT
        this.cs.requestCandidateDataRefresh()

        this.location.back()
        // this.router.navigate(["/education-and-certification"], {replaceUrl:true})
        
        
        /*await this.cs.candidateDataSubject.next(candidate); // Patch the candidate data
        await this.cs.candidateData.set(candidate); // Update cached data (this actually can be merged with the directive above)
        this.router.navigate(["/education-and-certification"])*/
      })
    }
  }

  deleteItem(){
    createDeletePrompt({} as any, this.alertController, this.translate, this.cs)
      .subscribe((response)=>{
        this.deleteIsLoading = true;
        this.cs.delete_exp(`/api/v2/self-candidate/${this.candidate.candidateId}/delete-education/${this.entityId}`, {})
          .pipe(
            finalize(()=>{this.deleteIsLoading = false})
          )
          .subscribe(async (response:any)=>{
            // !!! CAUTION, the data structure retrieved from server is DIFFERENT
            this.cs.requestCandidateDataRefresh()

            this.location.back()
            // this.router.navigate(["/education-and-certification"], {replaceUrl:true})
          })
      })
  }

}
