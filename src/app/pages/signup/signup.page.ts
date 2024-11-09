import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon, IonInput, IonSelect, IonSelectOption } from '@ionic/angular/standalone';
import { AbstractPage } from 'src/app/abstract-page';
import { Router } from '@angular/router';
import { BackButtonComponent } from "../../back-button/back-button.component";
import { phoneFullValidator, PhoneSelectorComponent } from 'src/app/submodules/phone-selector/phone-selector.component';
import { UxButtonComponent } from 'src/app/submodules/angular-ux-button/standalone/ux-button.component';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { catchError, finalize, map, throwError } from 'rxjs';
import { ContentService } from 'src/app/services/content.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: [
    './signup.page.scss',
    '../../stylesheets/login-signup.scss'
  ],
  standalone: true,
  imports: [IonSelect, IonSelectOption, IonInput, IonIcon, IonButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, BackButtonComponent,
    ReactiveFormsModule, PhoneSelectorComponent, UxButtonComponent
  ]
})
export class SignupPage extends AbstractPage implements OnInit{

  // The below datastructure is subjected to future change
  form:FormGroup = new FormGroup({
    'firstName': new FormControl("", [Validators.required, Validators.minLength(3), Validators.maxLength(25)]),
    'lastName': new FormControl("", [Validators.required, Validators.minLength(3), Validators.maxLength(25)]),
    'email': new FormControl("", [Validators.required, Validators.email]),
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
  formIsLoading: boolean = false;

  constructor(
    private router:Router,
    private httpClient: HttpClient, // Will be moved to contentService later
    private cs: ContentService,
  ) { 
    super(
      router
    );
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
  }

  async submit(){
    // Mark form as touched
    this.form.markAllAsTouched()
    if (this.form.invalid){
      this.displayErrors()
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
            this.displayedError['email'] = "Email already exists"
            this.form.controls['email'].setErrors({'email': true})
          }
          if (message.includes("Phone already exist") || message.includes("Le téléphone existe déjà")){ // TODO the french variant
            this.displayedError['phonefull'] = "Phone already exists"
            this.form.controls['phonefull'].setErrors({'phone': true})  
          }
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

  // Experimental feature (compute displayed error) client-side <--- (IMPORTANT, THIS CODE SHOULD BE AN UTILITIES)
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

}
