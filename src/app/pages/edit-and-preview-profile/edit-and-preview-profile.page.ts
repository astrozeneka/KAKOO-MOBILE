import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonIcon, IonButton } from '@ionic/angular/standalone';
import { ExperienceCardComponent } from 'src/app/components/experience-card/experience-card.component';
import { ProfileBasicDetailsCardComponent } from 'src/app/components/profile-basic-details-card/profile-basic-details-card.component';
import { ProfileJobPreferencesCardComponent } from "../../components/profile-job-preferences-card/profile-job-preferences-card.component";
import { ProfileSkillChipsCardComponent } from 'src/app/components/profile-skill-chips-card/profile-skill-chips-card.component';
import { ProfileSocialMediaLinksCardComponent } from 'src/app/components/profile-social-media-links-card/profile-social-media-links-card.component';
import { TopbarComponent } from 'src/app/components/topbar/topbar.component';
import { BackButtonComponent } from 'src/app/back-button/back-button.component';
import { SectionHeadingComponent } from 'src/app/components/section-heading/section-heading.component';

@Component({
  selector: 'app-edit-and-preview-profile',
  templateUrl: './edit-and-preview-profile.page.html',
  styleUrls: ['./edit-and-preview-profile.page.scss'],
  standalone: true,
  imports: [IonButton, IonIcon, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, ExperienceCardComponent,
    ProfileBasicDetailsCardComponent, ProfileJobPreferencesCardComponent, ProfileSkillChipsCardComponent,
    ProfileSocialMediaLinksCardComponent, TopbarComponent, BackButtonComponent, SectionHeadingComponent
  ]
})
export class EditAndPreviewProfilePage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
