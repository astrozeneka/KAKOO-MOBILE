import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon, IonInput, IonSelect, IonSelectOption } from '@ionic/angular/standalone';
import { AbstractPage } from 'src/app/abstract-page';
import { Router, RouterModule } from '@angular/router';
import { BackButtonComponent } from "../../back-button/back-button.component";
import { phoneFullValidator, PhoneSelectorComponent } from 'src/app/submodules/phone-selector/phone-selector.component';
import { UxButtonComponent } from 'src/app/submodules/angular-ux-button/standalone/ux-button.component';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { catchError, finalize, map, throwError } from 'rxjs';
import { ContentService } from 'src/app/services/content.service';
import { I18nPipeShortened } from 'src/app/i18n.pipe';
import { Browser } from '@capacitor/browser';
import { GoogleAuthorize } from 'src/app/models/GoogleAuthorize';
import { TopbarComponent } from 'src/app/components/topbar/topbar.component';
import { LanguageButtonComponent } from 'src/app/components/language-button/language-button.component';
import { displayErrors } from 'src/app/utils/display-errors';
import { TranslateService } from '@ngx-translate/core';
import { OutlineInputComponent } from 'src/app/components/outline-input/outline-input.component';
import { EmailValidator } from 'src/app/utils/validators';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: [
    './signup.page.scss',
    '../../stylesheets/login-signup.scss'
  ],
  standalone: true,
  imports: [IonSelect, IonSelectOption, IonInput, IonIcon, IonButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, BackButtonComponent,
    ReactiveFormsModule, PhoneSelectorComponent, UxButtonComponent, I18nPipeShortened, TopbarComponent, LanguageButtonComponent, OutlineInputComponent, RouterModule
  ]
})
export class SignupPage extends AbstractPage implements OnInit{

  // The below datastructure is subjected to future change
  form:FormGroup = new FormGroup({
    'firstName': new FormControl("", [Validators.required, Validators.minLength(3), Validators.maxLength(25)]),
    'lastName': new FormControl("", [Validators.required, Validators.minLength(3), Validators.maxLength(25)]),
    'email': new FormControl("", [Validators.required, EmailValidator]),
    'phonefull': new FormControl("", [phoneFullValidator]),
    // 'phone': undefined,     // Computed on submit
    // 'phoneCode': undefined, // Computed on submit
    'referralCode': new FormControl("", [])
  })
  // The below datastructure is subjected to future change
  displayedError:{[key:string]:string|undefined} = {
    'firstName': "Champ requis",
    'lastName': undefined,
    'email': undefined,
    'phonefull': undefined,
    // 'phone': undefined,     // Computed on submit
    // 'phoneCode': undefined, // Computed on submit
    'referralCode': undefined,
  }
  // Three button of logging (native, google and linkedin)
  formIsLoading: boolean = false;
  googleIsLoading: boolean = false;
  linkedinIsLoading: boolean = false;

  // 6. The language
  lang: "en"|"fr" = "en"

  constructor(
    private router:Router,
    private httpClient: HttpClient, // Will be moved to contentService later
    private cs: ContentService,
    private translate: TranslateService,
    private cdr: ChangeDetectorRef
  ) { 
    super(
      router
    );
    this.lang = (this.translate.currentLang.includes("fr") ? "fr" : "en") as "en"|"fr"
  }

  ngOnInit() {
    // Test 1. (to delete)
    /*this.form.controls['phonefull'].valueChanges.subscribe((value)=>{
      console.log(value)
    })*/

    // test 2. (value changes) (to delete)
    /*setTimeout(()=>{
      this.form.controls['phonefull'].patchValue(["+44", "11122211111"])
    }, 1000)*/


    // Feature for a better feedback management
    this.form.statusChanges.subscribe((status)=>{
      if (this.form.invalid) {
        displayErrors(this.form, this.displayedError, (v)=>this.translate.instant(v))
        this.cdr.detectChanges()
      }
    })
  }

  async submit(){
    // Mark form as touched
    this.form.markAllAsTouched()
    if (this.form.invalid){      
      displayErrors(this.form, this.displayedError, (v)=>this.translate.instant(v))
      return;
    }
    this.formIsLoading = true

    // Experiment 1. Try to send a request to the /api/v1/self-candidate/register endpoint
    // The pipe doesn't wotk like this (pipe first), then subscribe
    let data = {
      ...this.form.value,
      phoneCode: this.form.controls['phonefull'].value[0],
      phone: this.form.controls['phonefull'].value[1]
    }
    
    this.cs.post_exp('/api/v1/self-candidate/register', data, {})
      .pipe(catchError((error)=>{
        let message:string = error.error.message
        // If 400
        if (error.status == 400){
          console.log("Bad Request")
          console.log(error)
          
          if (message.includes("Email already exist") || message.includes("L'email existe déjà")){ // TODO the french variant
            // this.displayedError['email'] = "Email already exists"
            this.form.controls['email'].setErrors({'email_exists': true})
          }
          if (message.includes("Phone already exist") || message.includes("Le téléphone existe déjà")){ // TODO the french variant
            // this.displayedError['phonefull'] = "Phone already exists"
            this.form.controls['phonefull'].setErrors({'phone_exists': true})  
          }
          displayErrors(this.form, this.displayedError, (v)=>this.translate.instant(v))
        }
        /*if (status == 'BAD_REQUEST'){
          console.log("Bad Request")
          console.log("Errors")

          // The following code will be moved to a error management controller
          errors.forEach(e=>{
            let [field, message] = e.split(":")
            //this.displayedError[field] = message as string
          })
        }*/
        return throwError(error)
      }))
      .pipe(finalize(()=>{this.formIsLoading = false}))
      .subscribe((res)=>{
        this.router.navigate(['/check-your-email'])
      })
    
      /*
    this.httpClient.post('https://api.kakoo-software.com/api/v1/self-candidate/register', this.form.value)
      .subscribe((response)=>{
        console.log(response)
      })
        */

  }

  // Unused anymore, replaced by the utility function 'utils/displayErrors'
  /**
   * @deprecated use the global function in the utils instead
   */
  displayErrors(){
    // For all items in the form
    for (let key in this.form.controls){
      // If the item is invalid
      if (this.form.controls[key].invalid){
        if (this.form.controls[key].errors?.['required']){
          this.displayedError[key] = "Required field"
        } else if (this.form.controls[key].errors?.['email']){
          this.displayedError[key] = "Invalid email"
        } else if (this.form.controls[key].errors?.['phone']) {
          this.displayedError[key] = "Invalid phone number"
        } else if (this.form.controls[key].errors?.['minlength']) {
          this.displayedError[key] = "Too short"
        } else if (this.form.controls[key].errors?.['maxlength']) {
          this.displayedError[key] = "Too long"
        } else {
          console.warn("Unhandled vadation error message " + key)
        }
      } else {
        this.displayedError[key] = undefined
      }
    }
  }

  signupWithGoogle(){
    // This need to consult with the team
    this.googleIsLoading = true
    console.log("Calling /oauth2/authorize/google/v2")
    // Test to use /authorize/google/v2 Endpoint
    this.cs.get_exp('/oauth2/authorize/google/v2', {})
    .pipe(catchError((error)=>{
      console.log(error)
      return throwError(error)
    }))
    .subscribe((res:GoogleAuthorize)=>{
      // Open the browser (This doesn't work)
      console.log(res)
      Browser.open({url: res.url})
    })
  }

  signupWithLinkedin(){
    this.linkedinIsLoading = true
    console.log("Calling /oauth2/authorize/linkedin/v2")
    this.cs.get_exp('/oauth2/authorize/linkedin/v2', {})
    .pipe(catchError((error)=>{
      console.log(error)
      return throwError(error)
      // Maybe can try to use ngrok first, then talk with them to implement later
    }))
    .subscribe((res:any)=>{
      // Open the browser
      console.log(res)
      // Browser.open({url: res.url})
      // Maybe can try to use ngrok first, then talk with them to implement later
    })
  }

}
