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
import { Candidate, CandidateEducationEntity } from 'src/app/models/Candidate';
import { ContentService } from 'src/app/services/content.service';
import { Router } from '@angular/router';
import { createDeletePrompt, DeletableEntity } from 'src/app/utils/delete-prompt';
import { BehaviorSubject, catchError, finalize, map, throwError } from 'rxjs';
import {AlertController} from "@ionic/angular";
import { TranslateService } from '@ngx-translate/core';

interface UXCandidateEducationEntity extends CandidateEducationEntity, DeletableEntity {}

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

  // Candidate Education
  candidateEducationCertificateEntities: UXCandidateEducationEntity[] = []
  candidateEducationCertificateSubject = new BehaviorSubject<CandidateEducationEntity[]>([])
  candidateEducationCertificate$ = this.candidateEducationCertificateSubject.asObservable()
  processCandidateEducationCertificateEntities = (educationEntities:CandidateEducationEntity[]):UXCandidateEducationEntity[] =>{
    // same job as postLoadProcessing
    return educationEntities.map((educationEntity)=>{
      const existingEntity = this.candidateEducationCertificateEntities.find((entity)=>entity.id === educationEntity.id)
      const deleteIsLoadingSubject = existingEntity?.deleteIsLoadingSubject || new BehaviorSubject<boolean>(false)
      const fadeAwaySubject = existingEntity?.fadeAwaySubject || new BehaviorSubject<boolean>(false)
      return {
        ...educationEntity,
        deleteIsLoadingSubject,
        deleteIsLoading$: deleteIsLoadingSubject.asObservable(),
        fadeAwaySubject,
        fadeAway$: fadeAwaySubject.asObservable()
      }
    })
  }

  constructor(
    private cs:ContentService,
    public router:Router,
    public alertController:AlertController,
    public t: TranslateService,
  ) { }

  ngOnInit() {
    // Synchronizing data from candidate (from both the server and the cache)
    this.cs.registerCandidateDataObserverV3().subscribe((candidate)=>{
      console.log("HERRE")
      this.candidate = candidate!;

      // The Skills
      this.form.patchValue({
        skills: candidate?.skillListEntities.map((skill)=>skill.name) || []
      });

      // Education
      this.candidateEducationCertificateSubject.next(candidate?.candidateEducationEntities || [])

    })

    // Managing data: Education
    this.candidateEducationCertificate$
      .pipe(map(this.processCandidateEducationCertificateEntities))
      .subscribe((educationEntities:UXCandidateEducationEntity[])=>{
        this.candidateEducationCertificateEntities = educationEntities
      })
  }

  async deleteEducation(entity:UXCandidateEducationEntity){
    createDeletePrompt(entity, this.alertController, this.t, this.cs)
      .subscribe(async (response)=>{
        entity.fadeAwaySubject.next(true);
        this.cs.delete_exp(`/api/v2/self-candidate/${this.candidate.candidateId}/delete-education/${entity.id}`, {})
          .pipe(
            catchError((error)=>{return throwError(error)}),
            finalize(()=>{entity.deleteIsLoadingSubject.next(false)}))
          .subscribe(async (response)=>{
            this.cs.requestCandidateDataRefresh() // This will fire data to the ngOnInit code
          })
      })
  }

}
