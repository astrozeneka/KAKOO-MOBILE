import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonInput } from '@ionic/angular/standalone';
import { TopbarComponent } from 'src/app/components/topbar/topbar.component';
import { UxButtonComponent } from 'src/app/submodules/angular-ux-button/standalone/ux-button.component';
import { BackButtonComponent } from 'src/app/back-button/back-button.component';
import { ChipInputComponent } from 'src/app/components/chip-input/chip-input.component';
import { Candidate, ProjectPortfolioEntity } from 'src/app/models/Candidate';
import { EditAddForm } from 'src/app/utils/edit-add-form';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ContentService } from 'src/app/services/content.service';
import { displayErrors } from 'src/app/utils/display-errors';
import { catchError, finalize, throwError } from 'rxjs';
import { I18nPipeShortened } from 'src/app/i18n.pipe';
import { catch400Error } from 'src/app/utils/catch400Error';
import { UrlValidator } from 'src/app/submodules/url-validator/url-validator';

interface EditableProjectPortfolioEntity extends ProjectPortfolioEntity{
  skills: string[]
}

@Component({
  selector: 'app-project-form',
  templateUrl: './project-form.page.html',
  styleUrls: ['./project-form.page.scss'],
  standalone: true,
  imports: [IonInput, IonButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, TopbarComponent, IonButton, IonInput, UxButtonComponent,
    ReactiveFormsModule, BackButtonComponent, ChipInputComponent, I18nPipeShortened
  ]
})
export class ProjectFormPage extends EditAddForm<ProjectPortfolioEntity> implements OnInit {
  form:FormGroup = new FormGroup({
    projectTitle: new FormControl('', [Validators.required]),
    projectDescription: new FormControl('', [Validators.required]),
    projectURL: new FormControl('', [UrlValidator]),
    startDate: new FormControl('', [Validators.required]),
    endDate: new FormControl('', []),
    skills: new FormControl([], [])
  })
  displayedError:{[key:string]:string|undefined} = {
    projectTitle: undefined,
    projectDescription: undefined,
    projectURL: undefined,
    startDate: undefined,
    endDate: undefined,
    skills: undefined
  }
  protected override propertyAccessor: (c:Candidate) => any[] = (c)=>c.projectPortfolioEntities
  protected override prepareFormData = (pe: ProjectPortfolioEntity) => {
    return {
      ...pe,
      startDate: pe.startDate.split("T")[0],
      endDate: pe.endDate?.split("T")[0]
    }
  }
  protected override extractFormData = (ce: ProjectPortfolioEntity) => {
    return {
      ...ce,
      startDate: new Date(ce.startDate).toISOString(),
      endDate: ce.endDate ? new Date(ce.endDate).toISOString() : undefined,
      skillListEntities: [] // This is not handled in order to reach the project deadline
      /* skillListEntities: (ce as EditableProjectPortfolioEntity).skills.map((s)=>{
        return {
          // id: 8105, // This is a dummy value (will be updated later)
          id: 0,
          name: s
        }
      }) */
    } as ProjectPortfolioEntity
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

    console.log(this.candidate)
    console.log(this.candidate.skillListEntities)
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
      let data = [this.extractFormData(this.form.value)]
      console.log(data)
      // Error: the given id must not be null
      this.cs.post_exp(`/api/v2/self-candidate/${this.candidate.candidateId}/add-project-portfolio`, data, {})
        .pipe(
          catch400Error(this.cs), // Experimental feature
          finalize(()=>{this.formIsLoading = false;})
        )
        .subscribe(async (response:{code: any, type: any, message:string}|any)=>{
          this.cs.requestCandidateDataRefresh()
          this.router.navigate(["/projects"], {replaceUrl: true})
        })
    } else if (this.formMode == 'edit'){
      let data = this.extractFormData(this.form.value)
      this.cs.put_exp(`/api/v2/self-candidate/${this.candidate.candidateId}/update-project-portfolio/${this.entityId}`, data, {})
        .pipe(
          catch400Error(this.cs), // Experimental feature
          finalize(()=>{this.formIsLoading = false;})
        )
        .subscribe(async (response:{code: any, type: any, message:string}|any)=>{
          this.cs.requestCandidateDataRefresh()
          this.router.navigate(["/projects"], {replaceUrl: true})
        })
          

    }
  }

}
