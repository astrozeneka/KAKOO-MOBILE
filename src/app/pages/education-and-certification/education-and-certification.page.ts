import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonIcon, IonButton } from '@ionic/angular/standalone';
import { ExperienceCardComponent } from 'src/app/components/experience-card/experience-card.component';
import { SectionHeadingComponent } from "../../components/section-heading/section-heading.component";
import { TopbarComponent } from 'src/app/components/topbar/topbar.component';
import { BackButtonComponent } from 'src/app/back-button/back-button.component';

@Component({
  selector: 'app-education-and-certification',
  templateUrl: './education-and-certification.page.html',
  styleUrls: ['./education-and-certification.page.scss'],
  standalone: true,
  imports: [IonButton, IonIcon, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,
    ExperienceCardComponent, SectionHeadingComponent, TopbarComponent, BackButtonComponent]
})
export class EducationAndCertificationPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
