import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton } from '@ionic/angular/standalone';
import { TopbarComponent } from 'src/app/components/topbar/topbar.component';
import { BackButtonComponent } from 'src/app/back-button/back-button.component';
import { ChipInputComponent } from 'src/app/components/chip-input/chip-input.component';
import { UxButtonComponent } from 'src/app/submodules/angular-ux-button/standalone/ux-button.component';
import { Candidate } from 'src/app/models/Candidate';
import { ContentService } from 'src/app/services/content.service';
import { catchError, finalize, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { EmploymentType } from 'src/app/models/EmploymentType';
import { TranslateService } from '@ngx-translate/core';
import { HiringStatus } from 'src/app/models/HiringStatus';
import { WorkType } from 'src/app/models/WorkType';
import NoticePeriod from 'src/app/models/NoticePeriod';
import { SalaryExpectation } from 'src/app/models/SalaryExpectation';
import { displayErrors } from 'src/app/utils/display-errors';

@Component({
  selector: 'app-job-preferences',
  templateUrl: './job-preferences.page.html',
  styleUrls: ['./job-preferences.page.scss'],
  standalone: true,
  imports: [IonButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, TopbarComponent, BackButtonComponent, ChipInputComponent, ReactiveFormsModule,
    UxButtonComponent
  ]
})
export class JobPreferencesPage implements OnInit {
  candidate: Candidate = {} as any;
  form:FormGroup = new FormGroup({
    /*desiredWorkType: new FormControl<EmploymentType|null>(null, [Validators.required]),
    desiredSalaryUSD: new FormControl('', [Validators.required]),
    noticePeriodStr: new FormControl('', [Validators.required]),
    selfCandidateMobilityList: new FormControl([], [Validators.required]),*/


    /*employmentType: new FormControl<EmploymentType|null>(null, [Validators.required]),
    workType: new FormControl<WorkType|null>(null, [Validators.required]),
    salaryExpectation: new FormControl<SalaryExpectation|null>(null, [Validators.required]),
    noticePeriod: new FormControl<NoticePeriod|null>(null, [Validators.required]),
    hiringStatus: new FormControl<HiringStatus|null>(null, [Validators.required]),
    selfCandidateMobilities: new FormControl([], [Validators.required]), // will be rearranged on submit*/


    employmentTypeEntity: new FormControl<EmploymentType|null>(null, [Validators.required]),
    workTypeEntity: new FormControl<WorkType|null>(null, [Validators.required]),
    salaryExpectationEntity: new FormControl<SalaryExpectation|null>(null, [Validators.required]),
    noticePeriodEntity: new FormControl<NoticePeriod|null>(null, [Validators.required]),
    hiringStatusEntity: new FormControl<HiringStatus|null>(null, [Validators.required]),
    selfCandidateMobilityEntities: new FormControl([], [Validators.required]), // will be rearranged on submit
  })
  displayedError:{[key:string]:string|undefined} = {
    /*desiredWorkType: undefined,
    desiredSalaryUSD: undefined,
    noticePeriodStr: undefined,
    hiringStatusStr: undefined,
    //selfCandidateMobilities: undefined,

    employmentType: undefined,
    workType: undefined,
    salaryExpectation: undefined,
    noticePeriod: undefined,
    hiringStatus: undefined,
    selfCandidateMobilities: undefined,*/

    employmentTypeEntity: undefined,
    workTypeEntity: undefined,
    salaryExpectationEntity: undefined,
    noticePeriodEntity: undefined,
    hiringStatusEntity: undefined,
    selfCandidateMobilityEntities: undefined,
  }
  formIsLoading: boolean = false
  
  testFormControl:FormControl = new FormControl(null, [Validators.required])
  displayedErrorTest:string|undefined = undefined

  testMobilityControl: FormControl = new FormControl([], [Validators.required]);

  lang: "en"|"fr" = "en"
  // The options to be displayed on the form
  employmentTypeOptions: EmploymentType[] = []
  employmentTypeKeyAccessor: (e:EmploymentType) => string = (option: EmploymentType) => 
    (this.lang=="en" ? option.name : option.name_fr)
  workTypeOptions: WorkType[] = []
  workTypeKeyAccessor: (e:WorkType) => string = (option: WorkType) => 
    (this.lang=="en" ? option.name : option.name_fr)
  salaryExpectationOptions: SalaryExpectation[] = []
  salaryExpectationKeyAccessor: (e:SalaryExpectation) => string = (option: SalaryExpectation) => 
    (this.lang=="en" ? `From ${option.from_amount} ${option.currency} to ${option.to_amount} ${option.currency}` 
      : `De ${option.from_amount} ${option.currency} à ${option.to_amount} ${option.currency}`)
  hiringStatusOptions: HiringStatus[] = []
  hiringStatusKeyAccessor: (e:HiringStatus) => string = (option: HiringStatus) => 
    (this.lang=="en" ? option.name : option.name_fr)
  noticePeriodOptions: NoticePeriod[] = []
  noticePeriodKeyAccessor: (e:NoticePeriod) => string = (option: NoticePeriod) => 
    (this.lang=="en" ? option.name : option.name_fr)

  postLoadProcessing(){
    this.candidate.selfCandidateMobilityEntities = this.candidate.selfCandidateMobilityEntities?.map((v:any)=>v.name)
  }
  

  constructor(
    protected cs: ContentService,
    private router: Router,
    private translate: TranslateService,
    private cdr: ChangeDetectorRef
  ) { 
    this.lang = (this.translate.currentLang.includes("fr") ? "fr" : "en") as "en"|"fr"
  }

  ngOnInit() {

    // Step 1. Load candidate data
    this.cs.registerCandidateDataObserverV2()
      .subscribe(async (candidate: Candidate|null) => {
        this.candidate = candidate!
        this.postLoadProcessing()
        this.form.patchValue(this.candidate)
      })

    // Step 2. Load job preferences options from the server
    this._loadEmploymentTypeOptions().subscribe((employmentTypes)=>{
      this.employmentTypeOptions = employmentTypes
    })
    this._loadHiringStatusOptions().subscribe((hiringStatuses)=>{
      this.hiringStatusOptions = hiringStatuses
    })
    this._loadWorkTypeOptions().subscribe((workTypes)=>{
      this.workTypeOptions = workTypes
    })
    this._loadNoticePeriodOptions().subscribe((noticePeriods)=>{
      this.noticePeriodOptions = noticePeriods
    })
    this._loadSalaryExpectationOptions().subscribe((salaryExpectations)=>{
      this.salaryExpectationOptions = salaryExpectations
    })

    // test (delete later)
    /*this.form.get('desiredWorkType')?.valueChanges.subscribe((value)=>{
      console.log(value)
    })*/

    /*this.form.get('employmentType')?.valueChanges.subscribe((value)=>{
      console.log(value)
    })
    this.form?.valueChanges.subscribe((value) => {
      console.log(value)
    })*/
  }

  private _loadEmploymentTypeOptions(){
    return this.cs.get_exp_fullurl(`https://web.kakoo-software.com/kakoo-back-end/api/v1/employment-type`, {})
      // For later, the code below should be managed
      .pipe(catchError((error)=>{
        if (error.error.status == 400){ // Token invalid
          this.router.navigate(["/login"])
        }
        return throwError(error)
      })) as Observable<EmploymentType[]>
  }

  private _loadHiringStatusOptions(){
    return this.cs.get_exp_fullurl(`https://web.kakoo-software.com/kakoo-back-end/api/v1/hiring-status`, {})
    // For later, the code below should be managed
    .pipe(catchError((error)=>{
      if (error.error.status == 400){ // Token invalid
        this.router.navigate(["/login"])
      }
      return throwError(error)
    })) as Observable<HiringStatus[]>
  }

  private _loadWorkTypeOptions(){
    return this.cs.get_exp_fullurl(`https://web.kakoo-software.com/kakoo-back-end/api/v1/work-type`, {})
    // For later, the code below should be managed
    .pipe(catchError((error)=>{
      if (error.error.status == 400){ // Token invalid
        this.router.navigate(["/login"])
      }
      return throwError(error)
    })) as Observable<HiringStatus[]>
  }

  private _loadNoticePeriodOptions(){
    return this.cs.get_exp_fullurl(`https://web.kakoo-software.com/kakoo-back-end/api/v1/notice-period`, {})
    // For later, the code below should be managed
    .pipe(catchError((error)=>{
      if (error.error.status == 400){ // Token invalid
        this.router.navigate(["/login"])
      }
      return throwError(error)
    })) as Observable<HiringStatus[]>
  }

  private _loadSalaryExpectationOptions(){
    return this.cs.get_exp_fullurl(`https://web.kakoo-software.com/kakoo-back-end/api/v1/salary-expectation`, {})
    // For later, the code below should be managed
    .pipe(catchError((error)=>{
      if (error.error.status == 400){ // Token invalid
        this.router.navigate(["/login"])
      }
      return throwError(error)
    })) as Observable<SalaryExpectation[]>
  }

  testControlBlur(){
    this.displayedErrorTest = (this.testFormControl.errors as any)?.required ? "This field is required" : "";

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

    /*let data = {
      employmentTypeEntity: this.form.get('employmentType')?.value,
      workTypeEntity: this.form.get('workType')?.value,
      salaryExpectationEntity: this.form.get('salaryExpectation')?.value,
      noticePeriodEntity: this.form.get('noticePeriod')?.value,
      hiringStatusEntity: this.form.get('hiringStatus')?.value,
      selfCandidateMobilityEntities: this.form.get('selfCandidateMobilities')?.value.map(
        (v:any)=>({id:null, name:v})
      )
    }*/
    let data = {
      ...this.form.value,
      selfCandidateMobilityEntities: this.form.get('selfCandidateMobilityEntities')?.value.map(
        (v:any)=>({id:null, name:v})
      )
    }
    console.log(data);
    
    this.cs.post_exp(`/api/v1/self-candidate/${this.candidate.candidateId}/job-preference-work-availability`, data, {})
      .pipe(catchError((error)=>{
        // TODO, this pipe should be reused
        // The code below actually doesn't work
        if (error.error.status == 400){ // Token invalid
          this.router.navigate(["/login"])
        }
        return throwError(error)
      }), finalize(()=>{this.formIsLoading = false;}))
      .subscribe((result: Candidate)=>{
        this.router.navigate(["/social-accounts"])
      })
    
  }


}
