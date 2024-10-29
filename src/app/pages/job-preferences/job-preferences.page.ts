import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton } from '@ionic/angular/standalone';
import { TopbarComponent } from 'src/app/components/topbar/topbar.component';
import { BackButtonComponent } from 'src/app/back-button/back-button.component';
import { ChipInputComponent } from 'src/app/components/chip-input/chip-input.component';

@Component({
  selector: 'app-job-preferences',
  templateUrl: './job-preferences.page.html',
  styleUrls: ['./job-preferences.page.scss'],
  standalone: true,
  imports: [IonButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, TopbarComponent, BackButtonComponent, ChipInputComponent, ReactiveFormsModule]
})
export class JobPreferencesPage implements OnInit {
  testFormControl:FormControl = new FormControl(null, [Validators.required])
  displayedErrorTest:string|undefined = undefined

  testMobilityControl: FormControl = new FormControl([], [Validators.required]);

  constructor() { }

  ngOnInit() {
  }

  testControlBlur(){
    this.displayedErrorTest = (this.testFormControl.errors as any)?.required ? "This field is required" : "";

  }


}
