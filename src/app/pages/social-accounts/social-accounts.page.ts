import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule, TouchedChangeEvent, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton } from '@ionic/angular/standalone';
import { TopbarComponent } from 'src/app/components/topbar/topbar.component';
import { BackButtonComponent } from 'src/app/back-button/back-button.component';
import { SocialAccountInputComponent } from 'src/app/components/social-account-input/social-account-input.component';
import { filter } from 'rxjs';

@Component({
  selector: 'app-social-accounts',
  templateUrl: './social-accounts.page.html',
  styleUrls: ['./social-accounts.page.scss'],
  standalone: true,
  imports: [IonButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, TopbarComponent, BackButtonComponent, SocialAccountInputComponent, ReactiveFormsModule]
})
export class SocialAccountsPage implements OnInit {

  testFormControl = new FormControl('', [Validators.required, Validators.pattern('https?://.+')])
  displayedErrorTest:string|undefined = undefined

  constructor() { }

  ngOnInit() {

    // Test function
    this.testFormControl.events
      .subscribe((event)=>{
        console.log(this.testFormControl.errors)
        // This kind of code is not really useful since every validation is done on the server
          this.displayedErrorTest = (this.testFormControl.errors as any)?.required ? 'This field is required' 
          : (this.testFormControl.errors as any)?.pattern ? 'Is not a valid URL' : '';
      })
  }

}
