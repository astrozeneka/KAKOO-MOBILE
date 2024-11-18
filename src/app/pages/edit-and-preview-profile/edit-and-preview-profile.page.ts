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
import { Candidate, CandidateCertificateEntity, CandidateEducationEntity, ProjectPortfolioEntity, WorkExperienceEntity } from 'src/app/models/Candidate';
import { ContentService } from 'src/app/services/content.service';
import { Router } from '@angular/router';
import { createDeletePrompt, DeletableEntity } from 'src/app/utils/delete-prompt';
import { BehaviorSubject, catchError, finalize, map, throwError } from 'rxjs';
import {AlertController} from "@ionic/angular";
import { TranslateService } from '@ngx-translate/core';
import { I18nPipeShortened } from 'src/app/i18n.pipe';

interface UXCandidateEducationEntity extends CandidateEducationEntity, DeletableEntity {}
interface UXCandidateCertificateEntity extends CandidateCertificateEntity, DeletableEntity {}
interface UXWorkExperienceEntity extends WorkExperienceEntity, DeletableEntity {}
interface UXProjectPortfolioEntity extends ProjectPortfolioEntity, DeletableEntity {}

type Identifiable = CandidateEducationEntity & CandidateCertificateEntity & WorkExperienceEntity & ProjectPortfolioEntity

@Component({
  selector: 'app-edit-and-preview-profile',
  templateUrl: './edit-and-preview-profile.page.html',
  styleUrls: ['./edit-and-preview-profile.page.scss'],
  standalone: true,
  imports: [IonButton, IonIcon, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, ExperienceCardComponent,
    ProfileBasicDetailsCardComponent, ProfileJobPreferencesCardComponent, ProfileSkillChipsCardComponent,
    ProfileSocialMediaLinksCardComponent, TopbarComponent, BackButtonComponent, SectionHeadingComponent, ChipInputComponent,
    ChipInputComponent, ReactiveFormsModule, I18nPipeShortened
  ]
})
export class EditAndPreviewProfilePage implements OnInit {
  form:FormGroup = new FormGroup({
    'skills': new FormControl([], [])
  })
  displayedError:{[key:string]:string|undefined} = {
    'skills': undefined
  }

  candidate: Candidate = null as any;

  // Manage the fadeAway subject and the deleteIsloading (equivalent to the postLoadProcessing)
  processDeletableEntities = (entities:Identifiable[], existingDeletables:DeletableEntity[]):DeletableEntity[]=>{
    return entities.map((entity:Identifiable)=>{
      const existingEntity = existingDeletables.find((existingEntity)=>existingEntity.id === entity.id)
      const deleteIsLoadingSubject = existingEntity?.deleteIsLoadingSubject || new BehaviorSubject<boolean>(false)
      const fadeAwaySubject = existingEntity?.fadeAwaySubject || new BehaviorSubject<boolean>(false)
      return {
        ...entity,
        deleteIsLoadingSubject,
        deleteIsLoading$: deleteIsLoadingSubject.asObservable(),
        fadeAwaySubject,
        fadeAway$: fadeAwaySubject.asObservable()
      }
    })
  }

  // Candidate Education
  candidateEducationCertificateEntities: UXCandidateEducationEntity[] = []
  candidateEducationCertificateSubject = new BehaviorSubject<CandidateEducationEntity[]>([])
  candidateEducationCertificate$ = this.candidateEducationCertificateSubject.asObservable()

  // Candidate Certification
  candidateCertificateEntities: UXCandidateCertificateEntity[] = []
  candidateCertificateSubject = new BehaviorSubject<CandidateCertificateEntity[]>([])
  candidateCertificate$ = this.candidateCertificateSubject.asObservable()

  // Work Experience
  candidateWorkExperienceEntities: UXWorkExperienceEntity[] = []
  candidateWorkExperienceSubject = new BehaviorSubject<WorkExperienceEntity[]>([])
  candidateWorkExperience$ = this.candidateWorkExperienceSubject.asObservable()

  // Projects Portfolio
  candidateProjectEntities: UXProjectPortfolioEntity[] = []
  candidateProjectSubject = new BehaviorSubject<ProjectPortfolioEntity[]>([])
  candidateProject$ = this.candidateProjectSubject.asObservable()


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
      // Certification
      this.candidateCertificateSubject.next(candidate?.candidateCertificateEntities || [])
      // Work Experience
      this.candidateWorkExperienceSubject.next(candidate?.workExperienceEntities || [])
      // Projects
      this.candidateProjectSubject.next(candidate?.projectPortfolioEntities || [])

    })

    // Managing data: Education
    this.candidateEducationCertificate$
      .pipe(map((educations: CandidateEducationEntity[])=>
        this.processDeletableEntities(educations as Identifiable[], this.candidateEducationCertificateEntities)
      ))
      .subscribe((educationEntities:DeletableEntity[])=>{
        this.candidateEducationCertificateEntities = educationEntities as UXCandidateEducationEntity[]
      })
    // Manage data: Certification
    this.candidateCertificate$
      .pipe(map((certificates: CandidateCertificateEntity[])=>
        this.processDeletableEntities(certificates as Identifiable[], this.candidateCertificateEntities)))
      .subscribe((certificates:DeletableEntity[])=>{
        this.candidateCertificateEntities = certificates as UXCandidateCertificateEntity[]
      })
    // Manage data: Work Experience
    this.candidateWorkExperience$
      .pipe(map((workExperiences: WorkExperienceEntity[])=>
        this.processDeletableEntities(workExperiences as Identifiable[], this.candidateWorkExperienceEntities)))
      .subscribe((workExperiences:DeletableEntity[])=>{
        this.candidateWorkExperienceEntities = workExperiences as UXWorkExperienceEntity[]
      })
    // Manage data: Projects
    this.candidateProject$
      .pipe(map((projects: ProjectPortfolioEntity[])=>
        this.processDeletableEntities(projects as Identifiable[], this.candidateProjectEntities)))
      .subscribe((projects:DeletableEntity[])=>{
        this.candidateProjectEntities = projects as UXProjectPortfolioEntity[]
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

  async deleteCertificate(entity:UXCandidateCertificateEntity){
    createDeletePrompt(entity, this.alertController, this.t, this.cs)
      .subscribe(async (response)=>{
        entity.fadeAwaySubject.next(true);
        this.cs.delete_exp(`/api/v2/self-candidate/${this.candidate.candidateId}/delete-certificate/${entity.id}`, {})
          .pipe(
            catchError((error)=>{return throwError(error)}),
            finalize(()=>{entity.deleteIsLoadingSubject.next(false)}))
          .subscribe(async (response)=>{
            this.cs.requestCandidateDataRefresh() // This will fire data to the ngOnInit code
          })
      })
  }

  async deleteWorkExperience(entity:UXWorkExperienceEntity){
    createDeletePrompt(entity, this.alertController, this.t, this.cs)
      .subscribe(async (response)=>{
        entity.fadeAwaySubject.next(true);
        this.cs.delete_exp(`/api/v2/self-candidate/${this.candidate.candidateId}/delete-work-experience/${entity.id}`, {})
          .pipe(
            catchError((error)=>{return throwError(error)}),
            finalize(()=>{entity.deleteIsLoadingSubject.next(false)}))
          .subscribe(async (response)=>{
            this.cs.requestCandidateDataRefresh() // This will fire data to the ngOnInit code
          })
      })
  }

  async deleteProject(entity:UXProjectPortfolioEntity){
    createDeletePrompt(entity, this.alertController, this.t, this.cs)
      .subscribe(async (response)=>{
        entity.fadeAwaySubject.next(true);
        this.cs.delete_exp(`/api/v2/self-candidate/${this.candidate.candidateId}/delete-project-portfolio/${entity.id}`, {})
          .pipe(
            catchError((error)=>{return throwError(error)}),
            finalize(()=>{entity.deleteIsLoadingSubject.next(false)}))
          .subscribe(async (response)=>{
            this.cs.requestCandidateDataRefresh() // This will fire data to the ngOnInit code
          })
      })
  }

}
