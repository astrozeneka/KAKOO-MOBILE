import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon, IonInput, IonSelect, IonSelectOption } from '@ionic/angular/standalone';
import { AbstractPage } from 'src/app/abstract-page';
import { Router } from '@angular/router';
import { BackButtonComponent } from "../../back-button/back-button.component";
import { PhoneSelectorComponent } from 'src/app/submodules/phone-selector/phone-selector.component';
import { UxButtonComponent } from 'src/app/submodules/angular-ux-button/standalone/ux-button.component';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { catchError, map, throwError } from 'rxjs';
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
    'firstName': new FormControl("", [Validators.required]),
    'lastName': new FormControl("", [Validators.required]),
    'email': new FormControl("", [Validators.required, Validators.email]),
    'phone': new FormControl("", [Validators.required]),
    'phoneCode': new FormControl("", [Validators.required]),

    // Special variable
    'referralCode': new FormControl("", []), // ???
    'phoneRaw': new FormControl("", [])
  })
  // The below datastructure is subjected to future change
  displayedError = {
    'firstName': undefined,
    'lastName': undefined,
    'email': undefined,
    'phone': undefined,
    'phoneCode': undefined,

    'referralCode': undefined,
    'phoneRaw': undefined
  }
  formIsLoading: boolean = false;

  constructor(
    private router:Router,
    private httpClient: HttpClient, // Will be moved to contentService later
    private cs: ContentService
  ) { 
    super(
      router
    );
  }

  ngOnInit() {
  }

  async submit(){
    console.log(this.form.value)

    // Experiment 1. Try to send a request to the /api/v1/self-candidate/register endpoint
    // The pipe doesn't wotk like this (pipe first), then subscribe
    
    this.cs.post_exp('https://web.kakoo-software.com/kakoo-back-end/api/v2/self-candidate/register', this.form.value)
      .pipe(catchError((error)=>{
        let status = error.error.status
        let errors:string[] = error.error.errors
        if (status == 'BAD_REQUEST'){
          console.log("Bad Request")
          console.log("Errors")

          // The following code will be moved to a error management controller
          errors.forEach(e=>{
            let [field, message] = e.split(":")
            //this.displayedError[field] = message as string
          })
        }
        return throwError(error)
      }))
      .subscribe((res)=>{
      })
    
      /*
    this.httpClient.post('https://api.kakoo-software.com/api/v1/self-candidate/register', this.form.value)
      .subscribe((response)=>{
        console.log(response)
      })
        */

  }

}
