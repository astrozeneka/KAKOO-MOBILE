import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonButtons, IonInput, IonItem, IonLabel, IonIcon } from '@ionic/angular/standalone';
import { TopbarComponent } from 'src/app/components/topbar/topbar.component';
import { BackButtonComponent } from "../../back-button/back-button.component";
import { ChipInputComponent } from 'src/app/components/chip-input/chip-input.component';
import { phoneFullValidator, PhoneSelectorComponent } from "../../submodules/phone-selector/phone-selector.component";
import { Candidate, CityEntity, CountryEntity, LanguageEntity, StateEntity } from 'src/app/models/Candidate';
import { ContentService } from 'src/app/services/content.service';
import { catchError, filter, finalize, Observable, throwError } from 'rxjs';
import { UxButtonComponent } from "../../submodules/angular-ux-button/standalone/ux-button.component";
import { ActivatedRoute, Router } from '@angular/router';
import { ProdDebugButtonComponent } from 'src/app/dev-prod-components/debug-button/prod-debug-button/prod-debug-button.component';
import { DevDebugButtonComponent } from 'src/app/dev-prod-components/debug-button/dev-debug-button/dev-debug-button.component';
import { environment } from 'src/environments/environment';
import { catch400Error } from 'src/app/utils/catch400Error';
import { OutlineInputComponent } from "../../components/outline-input/outline-input.component";
import { TranslateService } from '@ngx-translate/core';
import { displayErrors } from 'src/app/utils/display-errors';
import { Location } from '@angular/common';
import { I18nPipeShortened } from 'src/app/i18n.pipe';

@Component({
  selector: 'app-personal-information',
  templateUrl: './personal-information.page.html',
  styleUrls: ['./personal-information.page.scss'],
  standalone: true,
  imports: [IonIcon, IonLabel, IonItem, IonInput, IonButtons, IonButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, TopbarComponent, BackButtonComponent, ChipInputComponent, ReactiveFormsModule, PhoneSelectorComponent, UxButtonComponent,
    ...(environment.production ? [ProdDebugButtonComponent] : [DevDebugButtonComponent]), OutlineInputComponent, I18nPipeShortened],
  providers: [
  ]
})
export class PersonalInformationPage implements OnInit {

  form: FormGroup = new FormGroup({
    'firstName': new FormControl("", [Validators.required, Validators.minLength(3), Validators.maxLength(25)]),
    'middleName': new FormControl("", [Validators.minLength(3), Validators.maxLength(25)]),
    'lastName': new FormControl("", [Validators.required, Validators.minLength(3), Validators.maxLength(25)]),
    'birthDay': new FormControl("", []), // Disabled actually
    'email': new FormControl("", [Validators.required, Validators.email]),

    'phonefull': new FormControl("", [phoneFullValidator]),
    
    'jobTitle': new FormControl("", []), // replaced by 'profile'
    'profile': new FormControl("", [Validators.required]), // Replace 'jobTitle'
    'totalExperience': new FormControl("", [Validators.required]), //
    'dailyRate': new FormControl("", [Validators.required]), //
    'languageEntities': new FormControl([], [Validators.required, Validators.minLength(1)]),
    
    'countryEntity': new FormControl(null, [Validators.required]), // 
    'stateEntity': new FormControl(null, [Validators.required]), // 
    'cityEntity': new FormControl(null, [Validators.required]), // 
    'address': new FormControl("", [Validators.required]), //
  })
  displayedError:{[key:string]:string|undefined} = {
    'firstName': undefined,
    'middleName': undefined,
    'lastName': undefined,
    'birthDay': undefined, // Disabled actually
    'email': undefined,
    'phonefull': undefined,
    'jobTitle': undefined, // Replaced by 'profile'
    'profile': undefined, // Replace 'jobTitle'
    'totalExperience': undefined,
    'dailyRate': undefined,
    'languageEntities': undefined,
    'countryEntity': undefined,
    'stateEntity': undefined,
    'cityEntity': undefined,
    'address': undefined,
  }
  formIsLoading: boolean = false;

  // Test (to be delted later)
  /*testFormControl:FormControl = new FormControl([], [Validators.required, Validators.minLength(2)]);
  testFormControl2:FormControl = new FormControl("");
  testCountryFormControl:FormControl = new FormControl(null, [Validators.required]);
  displayedErrorTest:string|undefined = undefined
  displayedErrorTest2:string|undefined = undefined
  displayedErrorTestCountry:string|undefined = undefined


  // Test (o be deleted later)
  testStateFormControl:FormControl = new FormControl(null, [Validators.required]);
  testCityFormControl:FormControl = new FormControl(null, [Validators.required]);
  displayedErrorTestState:string|undefined = undefined
  displayedErrorTestCity:string|undefined = undefined
  testStateControlBlur = () => {}
  testCityControlBlur = () => {}

  // test phone (to be deleted later)
  testPhoneFormControl:FormControl = new FormControl("+33123456789", [Validators.required]);
  displayedErrorTestPhone:string|undefined = "Required"
  testPhoneControlBlur = () => {}*/



  lang: "en"|"fr" = "en"
  languageOptions: LanguageEntity[] = []
  languageOptionsKeyAccessor = (language: LanguageEntity):string =>
    this.lang == "en" ? language.name : (language.nameFr||language.name) as string
  countryOptions: CountryEntity[] = []
  countryKeyAccessor = (country: CountryEntity) => country?.name;
  stateOptions: StateEntity[] = []
  stateKeyAccessor = (state: StateEntity) => state?.name;
  cityOptions: CityEntity[] = []
  cityKeyAccessor = (city: CityEntity) => city?.name;
  
  candidate: Candidate|null = null

  // Default: During the subscription process
  // Edit: Accessed from the edit-and-preview-profile
  formMode: 'default'|'edit' = 'default';

  constructor(
    private cdr:ChangeDetectorRef,
    private cs:ContentService,
    private router:Router,
    private translate: TranslateService,
    private route: ActivatedRoute,
    private location: Location
  ) {
    this.lang = (this.translate.currentLang.includes("fr") ? "fr" : "en") as "en"|"fr"
   }

  async ngOnInit() {
    this.formMode = this.route.snapshot.queryParamMap.get("mode") as any || 'default';


    // TODO, personal-information should use the registerV2 subscription
    // Waiting for it to have a thorough test first, then begin to implement in this page

    // 1. Load stored data loaded from resume OR FROM THE SERVER
    this.cs.registerCandidateDataObserverV3().subscribe((candidate:Candidate|null)=>{
      if (!candidate){
        console.warn("No candidate data")
        return
      }
      this.candidate = candidate
      
      // In case of the form was previously filled
      /*this.form.get('countryEntity')?.enable() // No need
      this._loadCountryOptions().subscribe((countryOptions:CountryEntity[])=>{
        this.countryOptions = countryOptions
        this.form.patchValue({countryEntity: candidate.countryEntity})
        if (candidate.countryEntity) {
          
        }
      })*/
      

      /*if (candidate.stateEntity) this.form.get('stateEntity')?.enable()
      if (candidate.cityEntity) this.form.get('cityEntity')?.enable()
      this.form.patchValue(candidate)*/
    
    })

    // OLd way of loading candidate data
    let extractedData: Candidate|null = await this.cs.candidateData.get();
    console.log(extractedData)

    // 1.a - Patch the phone number
    extractedData = {
      ...extractedData,
      phonefull: [extractedData?.phoneCode, extractedData?.phoneNumber],
      languages: extractedData?.languageEntities ?? [],
      // languages: extractedData?.languageEntities?.map((languageEntity)=>languageEntity.name),
      // The other data needing preparation,
      experience: null, // Should be managed later
    } as any
    console.log(extractedData)

    setTimeout(()=>{
      this.form.patchValue(extractedData as any);
    }, 100)



    // Feature for a better feedback management (I think it is ok)
    this.form.statusChanges.subscribe((status)=>{
      if (this.form.invalid) {
        console.log("Form is invalid")
        displayErrors(this.form, this.displayedError, (v)=>this.translate.instant(v))
        this.cdr.detectChanges()
      }
    })

    // Step 2. Load the dropdown values
    this._loadLanguageOptions().subscribe((languageOptions)=>{
      this.languageOptions = languageOptions
    })
    this._loadCountryOptions().subscribe((countryOptions)=>{
      this.countryOptions = countryOptions
    })

    // At first state and city will be disabled, and will be enabled only when the above entity is selected
    this.form.get('stateEntity')?.disable()
    this.form.get('cityEntity')?.disable()
    this.form.get('countryEntity')?.valueChanges.subscribe((country:CountryEntity)=>{
      if (country) {
        this._loadStateOptions(country.countryId).subscribe((stateOptions:StateEntity[])=>{
          this.stateOptions = stateOptions
          this.form.get('stateEntity')?.enable()
          if (this.candidate?.stateEntity){
            this.form.get('stateEntity')?.patchValue(this.candidate?.stateEntity)
          } else {
            this.form.get('stateEntity')?.reset()
          }
        })
      } else {
        this.form.get('stateEntity')?.disable()
        this.form.get('cityEntity')?.disable()
      }
    })
    this.form.get('stateEntity')?.valueChanges.subscribe((state:StateEntity)=>{
      if (state) {
        this._loadCityOptions(state.stateId).subscribe((cityOptions:CityEntity[])=>{
          if (this.candidate?.cityEntity){
            this.form.get('cityEntity')?.patchValue(this.candidate?.cityEntity)
          }else{
            this.form.get('cityEntity')?.reset();
          }
          this.form.get('cityEntity')?.enable();
          this.cityOptions = cityOptions
        })
      } else {
        this.form.get('cityEntity')?.disable();
      }
    })


    /*this.testFormControl.valueChanges.subscribe((value) => {
    })

    this.testPhoneFormControl.valueChanges.subscribe((value) => {
      console.log("Changed")
      console.log(value)
    })

    // Test phone control
    setTimeout(()=>{
      this.testPhoneFormControl.patchValue("+33123456789")
    }, 300)*/
  
    // 4. Skip birthday and job title for now (might be updated later)
    //this.form.get('birthDay')?.disable()
    //this.form.get('jobTitle')?.disable()

  }


  private _loadLanguageOptions(){
    return this.cs.get_exp_fullurl(`https://web.kakoo-software.com/kakoo-back-end/api/v1/candidate-drop-down/language`, {})
      .pipe(catchError((error) => {
          return throwError(error);
        })) as unknown as Observable<LanguageEntity[]>
  }
  private _loadCountryOptions(){
    return this.cs.get_exp_fullurl(`https://web.kakoo-software.com/kakoo-back-end/api/v1/location/get-country`, {})
      .pipe(catchError((error) => {
        return throwError(error)
      })) as Observable<CountryEntity[]>
  }
  private _loadStateOptions(countryId:number){
    return this.cs.get_exp_fullurl(`https://web.kakoo-software.com/kakoo-back-end/api/v1/location/get-state-by-country/${countryId}`, {})
      .pipe(catchError((error) => {
        return throwError(error)
      })) as Observable<StateEntity[]>
  }
  private _loadCityOptions(stateId:number){ // Not yet tested
    return this.cs.get_exp_fullurl(`https://web.kakoo-software.com/kakoo-back-end/api/v1/location/get-city-by-state/${stateId}`, {})
      .pipe(catchError((error) => {
        return throwError(error)
      })) as Observable<CityEntity[]>
  }

  skip(){
    // Might be subjected to updates later
    this.router.navigate(['/add-skills'])
  }

  submit(){
    // Manage form validation
    this.form.markAllAsTouched()
    if (this.form.invalid){
      displayErrors(this.form, this.displayedError, (v)=>this.translate.instant(v))
      return;
    }
    console.log(this.form.value.formfull)
    let [phoneCode, phoneNumber] = this.form.value.phonefull
    let data = {
      ...this.form.value,
      phoneCode,
      phoneNumber
      // TODO birthday, Experience
    }
    console.log(data)
    this.formIsLoading = true
    // Develop the patch method
    this.cs.post_exp('/api/v1/self-candidate/basic-information', data, {})
      .pipe(
        catch400Error(this.cs), // Experimental feature
        finalize(()=>{this.formIsLoading = false})
      )
      .subscribe(async (response)=>{
        let candidate: Candidate = response as Candidate
        await this.cs.candidateData.set(candidate)
        if (this.formMode == 'default'){
          this.router.navigate(['/add-skills'])
        } else {
          this.cs.requestCandidateDataRefresh()
          this.location.back()
        }
      })
  }
}
