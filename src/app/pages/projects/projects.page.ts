import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon } from '@ionic/angular/standalone';
import { TopbarComponent } from 'src/app/components/topbar/topbar.component';
import { BackButtonComponent } from 'src/app/back-button/back-button.component';
import { ExperienceCardComponent } from 'src/app/components/experience-card/experience-card.component';
import { SectionHeadingComponent } from 'src/app/components/section-heading/section-heading.component';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.page.html',
  styleUrls: ['./projects.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, TopbarComponent, BackButtonComponent, IonButton, ExperienceCardComponent, IonIcon,
    SectionHeadingComponent
  ]
})
export class ProjectsPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
