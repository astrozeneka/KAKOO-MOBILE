import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonButtons, IonInput } from '@ionic/angular/standalone';
import { TopbarComponent } from 'src/app/components/topbar/topbar.component';
import { BackButtonComponent } from "../../back-button/back-button.component";
import { ChipInputComponent } from 'src/app/components/chip-input/chip-input.component';

@Component({
  selector: 'app-personal-information',
  templateUrl: './personal-information.page.html',
  styleUrls: ['./personal-information.page.scss'],
  standalone: true,
  imports: [IonInput, IonButtons, IonButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, TopbarComponent, BackButtonComponent, ChipInputComponent, ReactiveFormsModule],
  providers: [
  ]
})
export class PersonalInformationPage implements OnInit {

  // Test (to be delted later)
  testFormControl:FormControl = new FormControl([], [Validators.required, Validators.minLength(2)]);
  testFormControl2:FormControl = new FormControl("");
  displayedErrorTest:string|undefined = undefined
  displayedErrorTest2:string|undefined = undefined

  constructor() { }

  ngOnInit() {
    this.testFormControl.valueChanges.subscribe((value) => {
    })
  

  }

  testControlBlur(){
    this.displayedErrorTest = 
    (this.testFormControl.errors as any)?.required ? "This field is required"
    : (this.testFormControl.errors as any)?.minlength ? "You should at least add 2 skills" : undefined;
    console.log("DisplayedErrorTest", this.displayedErrorTest)
    console.log("Errors", this.testFormControl.errors)
  }

  testSubmit(){

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
    this.testFormControl.setErrors({serverError: true});
    this.testFormControl.markAsTouched();
    
  }
  

}
