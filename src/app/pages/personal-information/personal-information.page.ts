import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonButtons, IonInput, IonItem, IonLabel } from '@ionic/angular/standalone';
import { TopbarComponent } from 'src/app/components/topbar/topbar.component';
import { BackButtonComponent } from "../../back-button/back-button.component";
import { ChipInputComponent } from 'src/app/components/chip-input/chip-input.component';
import { PhoneSelectorComponent } from "../../submodules/phone-selector/phone-selector.component";

@Component({
  selector: 'app-personal-information',
  templateUrl: './personal-information.page.html',
  styleUrls: ['./personal-information.page.scss'],
  standalone: true,
  imports: [IonLabel, IonItem, IonInput, IonButtons, IonButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, TopbarComponent, BackButtonComponent, ChipInputComponent, ReactiveFormsModule, PhoneSelectorComponent],
  providers: [
  ]
})
export class PersonalInformationPage implements OnInit {

  // Test (to be delted later)
  testFormControl:FormControl = new FormControl([], [Validators.required, Validators.minLength(2)]);
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
  testPhoneControlBlur = () => {}

  countryKeyAccessor = (country: any) => country.name;

  constructor(
    private cdr:ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.testFormControl.valueChanges.subscribe((value) => {
    })

    this.testPhoneFormControl.valueChanges.subscribe((value) => {
      console.log("Changed")
      console.log(value)
    })

    // Test phone control
    setTimeout(()=>{
      this.testPhoneFormControl.patchValue("+33123456789")
    }, 300)
  

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
    
  }
  
  testCountryControlBlur(){
    this.displayedErrorTestCountry = 
    (this.testCountryFormControl.errors as any)?.required ? "This field is required"
    : undefined;
    console.log("Test error")
  }

}
