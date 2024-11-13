import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, TouchedChangeEvent, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton } from '@ionic/angular/standalone';
import { TopbarComponent } from 'src/app/components/topbar/topbar.component';
import { BackButtonComponent } from 'src/app/back-button/back-button.component';
import { SocialAccountInputComponent } from 'src/app/components/social-account-input/social-account-input.component';
import { catchError, filter, finalize, forkJoin, Observable, throwError } from 'rxjs';
import { Candidate } from 'src/app/models/Candidate';
import { ContentService } from 'src/app/services/content.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { key } from 'ionicons/icons';
import { displayErrors } from 'src/app/utils/display-errors';
import { UxButtonComponent } from 'src/app/submodules/angular-ux-button/standalone/ux-button.component';
import { catch400Error } from 'src/app/utils/catch400Error';
import { AtLeastOneFieldRequiredValidator, UrlValidator } from 'src/app/utils/validators';

@Component({
  selector: 'app-social-accounts',
  templateUrl: './social-accounts.page.html',
  styleUrls: ['./social-accounts.page.scss'],
  standalone: true,
  imports: [IonButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, TopbarComponent, BackButtonComponent, SocialAccountInputComponent, ReactiveFormsModule,
    UxButtonComponent
  ]
})
export class SocialAccountsPage implements OnInit {
  candidate: Candidate = {} as any;
  candidateSocialAccounts:{[key:string]:string} = {}
  form:FormGroup = new FormGroup({
    "facebook": new FormControl('', [UrlValidator]),
    "x": new FormControl('', [Validators.pattern('https?://.+')]),
    "linkedin": new FormControl('', [Validators.pattern('https?://.+')]),
    "instagram": new FormControl('', [Validators.pattern('https?://.+')]),
    "youtube": new FormControl('', [Validators.pattern('https?://.+')]),
    "github": new FormControl('', [Validators.pattern('https?://.+')])
  
  }, {validators: AtLeastOneFieldRequiredValidator}) // Experimental validator

  displayedError:{[key:string]:string|undefined} = {
    facebook: undefined,
    x: undefined,
    linkedin: undefined,
    instagram: undefined,
    youtube: undefined,
    github: undefined,
    ".": undefined
  }
  formIsLoading: boolean = false

  lang: "en"|"fr" = "en"

  postLoadProcessing(){
    // Set the form values
    let mediaTypes = Object.keys(this.form.controls)
    this.candidateSocialAccounts = {}
    mediaTypes.forEach((mediaType)=>{
      let socialAccount = this.candidate.socialAccountEntities.find((entity)=>entity.name.toLowerCase() == mediaType)
      if(socialAccount){
        this.candidateSocialAccounts[mediaType] = socialAccount.profileUrl
      }
    })
    console.log(this.candidateSocialAccounts)
  }

  /*testFormControl = new FormControl('', [Validators.required, Validators.pattern('https?://.+')])
  displayedErrorTest:string|undefined = undefined*/

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
      .subscribe((candidate)=>{
        this.candidate = candidate!
        this.postLoadProcessing()
        this.form.patchValue(this.candidateSocialAccounts)
        console.log(this.candidateSocialAccounts)
        this.cdr.detectChanges()
      })

    // Test function
    /*this.testFormControl.events
      .subscribe((event)=>{
        console.log(this.testFormControl.errors)
        // This kind of code is not really useful since every validation is done on the server
          this.displayedErrorTest = (this.testFormControl.errors as any)?.required ? 'This field is required' 
          : (this.testFormControl.errors as any)?.pattern ? 'Is not a valid URL' : '';
      })*/

    // Handling validation error for a better feedback management
    this.form.statusChanges.subscribe((status)=>{
      if (this.form.invalid) {
        displayErrors(this.form, this.displayedError, (v)=>this.translate.instant(v))
        this.cdr.detectChanges()
      }
    })
  }

  skip(){
    // Might be subjected to future updates
    this.router.navigate(["/terms-and-conditions"])
  }

  submit(){
    // Mark form as touched
    this.form.markAllAsTouched()
    if (this.form.invalid){
      displayErrors(this.form, this.displayedError, (v)=>this.translate.instant(v))
      // console.log(this.form.errors) // Delete later
      this.cdr.detectChanges()
      return;
    }
    this.formIsLoading = true
    
    // The submission is a quite different because we will send each link individually
    // According to the API docs
    let socialAccountEntities = Object.keys(this.form.controls).map((key)=>{
      const existing = this.candidate.socialAccountEntities.find((entity)=>entity.name.toLowerCase() == key)
      return {
        ...(existing?{id: existing.id}:{}),
        name: key,
        profileUrl: this.form.get(key)?.value
      }
    })
    let observables:Array<Observable<any>|null> = socialAccountEntities.map((entity)=>{
      if(entity.profileUrl == ''){
        return null
      }if(entity.id){ // Update existing
        return this.cs.put_exp(`/api/v2/self-candidate/${this.candidate.candidateId}/update-social-account/${entity.id}`, entity, {})
          .pipe(
            catch400Error(this.cs), // Experimental feature
          )
      }else{ // Add new
        return this.cs.post_exp(`/api/v2/self-candidate/${this.candidate.candidateId}/add-social-account`, [entity], {})
          .pipe(
            catch400Error(this.cs), // Experimental feature
          )
      }
    }).filter(o => o!=null) as Array<Observable<any>>

    console.log(observables)
    this.formIsLoading = true
    forkJoin(observables)
      .pipe(finalize(()=>{this.formIsLoading = false}))
      .subscribe(results => {
        console.log(results)
        this.router.navigate(["/terms-and-conditions"])
      })

    
  }

}
