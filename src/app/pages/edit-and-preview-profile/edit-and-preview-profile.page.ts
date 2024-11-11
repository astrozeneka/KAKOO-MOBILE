import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonIcon, IonButton } from '@ionic/angular/standalone';
import { ExperienceCardComponent } from 'src/app/components/experience-card/experience-card.component';
import { ProfileBasicDetailsCardComponent } from 'src/app/components/profile-basic-details-card/profile-basic-details-card.component';
import { ProfileJobPreferencesCardComponent } from "../../components/profile-job-preferences-card/profile-job-preferences-card.component";
import { ProfileSkillChipsCardComponent } from 'src/app/components/profile-skill-chips-card/profile-skill-chips-card.component';
import { ProfileSocialMediaLinksCardComponent } from 'src/app/components/profile-social-media-links-card/profile-social-media-links-card.component';
import { TopbarComponent } from 'src/app/components/topbar/topbar.component';
import { BackButtonComponent } from 'src/app/back-button/back-button.component';
import { SectionHeadingComponent } from 'src/app/components/section-heading/section-heading.component';
import { ChipInputComponent } from "../../components/chip-input/chip-input.component";
import { Candidate } from 'src/app/models/Candidate';
import { ContentService } from 'src/app/services/content.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-and-preview-profile',
  templateUrl: './edit-and-preview-profile.page.html',
  styleUrls: ['./edit-and-preview-profile.page.scss'],
  standalone: true,
  imports: [IonButton, IonIcon, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, ExperienceCardComponent,
    ProfileBasicDetailsCardComponent, ProfileJobPreferencesCardComponent, ProfileSkillChipsCardComponent,
    ProfileSocialMediaLinksCardComponent, TopbarComponent, BackButtonComponent, SectionHeadingComponent, ChipInputComponent,
    ChipInputComponent, ReactiveFormsModule
  ]
})
export class EditAndPreviewProfilePage implements OnInit {
  form:FormGroup = new FormGroup({
    'skills': new FormControl([], [])
  })
  displayedError:{[key:string]:string|undefined} = {
    'skills': undefined
  }

  candidate: Candidate = {} as any;

  constructor(
    private cs:ContentService,
    private router:Router
  ) { }

  ngOnInit() {
    this.cs.registerCandidateDataObserverV3().subscribe((candidate)=>{
      this.candidate = candidate!;
      this.form.patchValue({
        skills: candidate?.skillListEntities.map((skill)=>skill.name) || []
      });
    })
  }

}
