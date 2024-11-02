import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton } from '@ionic/angular/standalone';
import { ChipInputComponent } from 'src/app/components/chip-input/chip-input.component';
import { TopbarComponent } from 'src/app/components/topbar/topbar.component';
import { BackButtonComponent } from 'src/app/back-button/back-button.component';

@Component({
  selector: 'app-add-skills',
  templateUrl: './add-skills.page.html',
  styleUrls: ['./add-skills.page.scss'],
  standalone: true,
  imports: [IonButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, ReactiveFormsModule,
    ChipInputComponent, TopbarComponent, BackButtonComponent
  ]
})
export class AddSkillsPage implements OnInit {
  testSkillsFormControl:FormControl = new FormControl([], []);
  displayedErrorTestSkills = undefined;
  testSkillsControlBlur = ()=>{}

  constructor() { }

  ngOnInit() {
  }

}
