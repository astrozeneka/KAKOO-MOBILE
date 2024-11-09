import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonButtons, IonInput, IonItem, IonLabel, IonIcon } from '@ionic/angular/standalone';
import { TopbarComponent } from 'src/app/components/topbar/topbar.component';
import { BackButtonComponent } from "../../back-button/back-button.component";
import { ChipInputComponent } from 'src/app/components/chip-input/chip-input.component';
import { phoneFullValidator, PhoneSelectorComponent } from "../../submodules/phone-selector/phone-selector.component";
import { Candidate } from 'src/app/models/Candidate';
import { ContentService } from 'src/app/services/content.service';
import { catchError, finalize, throwError } from 'rxjs';
import { UxButtonComponent } from "../../submodules/angular-ux-button/standalone/ux-button.component";
import { Router } from '@angular/router';
import { ProdDebugButtonComponent } from 'src/app/dev-prod-components/debug-button/prod-debug-button/prod-debug-button.component';
import { DevDebugButtonComponent } from 'src/app/dev-prod-components/debug-button/dev-debug-button/dev-debug-button.component';
import { environment } from 'src/environments/environment';
import { catch400Error } from 'src/app/utils/catch400Error';
import { OutlineInputComponent } from "../../components/outline-input/outline-input.component";
import { TranslateService } from '@ngx-translate/core';
import { displayErrors } from 'src/app/utils/display-errors';

@Component({
  selector: 'app-personal-information',
  templateUrl: './personal-information.page.html',
  styleUrls: ['./personal-information.page.scss'],
  standalone: true,
  imports: [IonIcon, IonLabel, IonItem, IonInput, IonButtons, IonButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, TopbarComponent, BackButtonComponent, ChipInputComponent, ReactiveFormsModule, PhoneSelectorComponent, UxButtonComponent,
    ...(environment.production ? [ProdDebugButtonComponent] : [DevDebugButtonComponent]), OutlineInputComponent],
  providers: [
  ]
})
export class PersonalInformationPage implements OnInit {

  form: FormGroup = new FormGroup({
    'firstName': new FormControl("", [Validators.required, Validators.minLength(3), Validators.maxLength(25)]),
    'middleName': new FormControl("", [Validators.minLength(3), Validators.maxLength(25)]),
    'lastName': new FormControl("", [Validators.required, Validators.minLength(3), Validators.maxLength(25)]),
    'birthDay': new FormControl("", [Validators.required]), // ACTUALLY, NOT PRESENT IN THE ACTUAL SAMPLE DATA
    'email': new FormControl("", [Validators.required, Validators.email]),

    'phonefull': new FormControl("", [phoneFullValidator]),
    
    'jobTitle': new FormControl("", []), // NOT PRESENT IN THE ACTUAL SYSTEM, should be tested thoroughly
    'totalExperience': new FormControl("", [Validators.required]), // ok
    'dailyRate': new FormControl("", [Validators.required]), // ok
    'languages': new FormControl([], [Validators.required, Validators.minLength(1)]), // !!! Should prepare it while form submission
    
    'country': new FormControl(null, [Validators.required]), // !!! Should prepare it while form submission
    'state': new FormControl(null, [Validators.required]), // !!! Should prepare it while form submission
    'city': new FormControl(null, [Validators.required]), // !!! Should prepare it while form submission
    'address': new FormControl("", [Validators.required]), // ok
  })
  displayedError:{[key:string]:string|undefined} = {
    'firstName': undefined,
    'middleName': undefined,
    'lastName': undefined,
    'birthDay': undefined, // ?????
    'email': undefined,
    'phonefull': undefined,
    'jobTitle': undefined,
    'totalExperience': undefined,
    'dailyRate': undefined,
    'languages': undefined,
    'country': undefined,
    'state': undefined,
    'city': undefined,
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

  countryKeyAccessor = (country: any) => country.name;

  constructor(
    private cdr:ChangeDetectorRef,
    private cs:ContentService,
    private router:Router,
    private translate: TranslateService,
  ) { }

  async ngOnInit() {

    // TODO, personal-information should use the registerV2 subscription
    // Waiting for it to have a thorough test first, then begin to implement in this page

    // 1. Load stored data loaded from resume
    let extractedData: Candidate|null = await this.cs.candidateData.get();

    // 1.a - Patch the phone number
    extractedData = {
      ...extractedData,
      phonefull: [extractedData?.phoneCode, extractedData?.phoneNumber],
      languages: extractedData?.languageEntities?.map((languageEntity)=>languageEntity.name),
      // The other data needing preparation
    } as any
    console.log(extractedData)

    this.form.patchValue(extractedData as any);



    // Feature for a better feedback management (I think it is ok)
    this.form.statusChanges.subscribe((status)=>{
      if (this.form.invalid) {
        console.log("Form is invalid")
        displayErrors(this.form, this.displayedError, (v)=>this.translate.instant(v))
        this.cdr.detectChanges()
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
  

  }

  /*testControlBlur(){
    this.displayedErrorTest = 
    (this.testFormControl.errors as any)?.required ? "This field is required"
    : (this.testFormControl.errors as any)?.minlength ? "You should at least add 2 skills" : undefined;
    console.log("DisplayedErrorTest", this.displayedErrorTest)
    console.log("Errors", this.testFormControl.errors)
  }*/

  /*testSubmit(){

    console.log(this.testFormControl.errors)
    
    // THIS IS THE STANDARD WAY TO SET ERRORS ON CONTROLS
    this.displayedErrorTest2 = "This is an error message from the server";
    this.testFormControl2.setErrors({serverError: true});
    this.testFormControl2.markAsTouched();

    // Test on the firstControl
    // similarly to previous projects, the displayedError text is managed from the parent
    // However
    this.displayedErrorTest = 
      (this.testFormControl.errors as any).required ? "This field is required"
      : (this.testFormControl.errors as any).minLength ? "You should at least add 2 skills" : undefined;
    this.testFormControl.setErrors({required: true});
    this.testFormControl.markAsTouched();

    // The county
    this.testCountryFormControl.setErrors({required: true});
    this.displayedErrorTestCountry = 
    (this.testCountryFormControl.errors as any)?.required ? "This field is required"
    : undefined;
    this.testCountryFormControl.markAsTouched();

    // The phone
    this.testPhoneFormControl.setErrors({required: true});
    this.displayedErrorTestPhone = 
    (this.testPhoneFormControl.errors as any)?.required ? "This field is required"
    : undefined;
    this.testPhoneFormControl.markAsTouched();
    
  }*/
  
  /*testCountryControlBlur(){
    this.displayedErrorTestCountry = 
    (this.testCountryFormControl.errors as any)?.required ? "This field is required"
    : undefined;
    console.log("Test error")
  }*/

  submit(){
    // Manage form validation
    this.form.markAllAsTouched()
    if (this.form.invalid){
      displayErrors(this.form, this.displayedError, (v)=>this.translate.instant(v))
      return;
    }
    
    let data = {
      ...this.form.value,
      languageEntities: null, // !!! Should prepare it while form submission
      phoneCode: null, // !!! should prepare
      phoneNumber: null, // !!! should prepare
      countryEntity: null, // !!! should prepare
      stateEntity: null, // !!! should prepare
      cityEntity: null, // !!! should prepare
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
        this.router.navigate(['/add-skills'])
      })
  }
}
