import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon } from '@ionic/angular/standalone';
import { TopbarComponent } from 'src/app/components/topbar/topbar.component';
import { BackButtonComponent } from "../../back-button/back-button.component";
import { ExperienceCardComponent } from "../../components/experience-card/experience-card.component";
import { SectionHeadingComponent } from 'src/app/components/section-heading/section-heading.component';
import { ContentService } from 'src/app/services/content.service';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { I18nPipeShortened } from 'src/app/i18n.pipe';
import {AlertController} from "@ionic/angular";
import { CandidateForm } from 'src/app/utils/candidate-form';
import { Candidate, WorkExperienceEntity } from 'src/app/models/Candidate';
import { BehaviorSubject, catchError, filter, finalize, Observable, throwError } from 'rxjs';
import { catch400Error } from 'src/app/utils/catch400Error';
import { createDeletePrompt } from 'src/app/utils/delete-prompt';

interface UXWorkExperienceEntity extends WorkExperienceEntity {
  deleteIsLoadingSubject: BehaviorSubject<boolean>;
  deleteIsLoading$: Observable<boolean>;
  fadeAwaySubject: BehaviorSubject<boolean>;
  fadeAway$: Observable<boolean>;
}

@Component({
  selector: 'app-work-experience',
  templateUrl: './work-experience.page.html',
  styleUrls: ['./work-experience.page.scss'],
  standalone: true,
  imports: [IonIcon, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, TopbarComponent, BackButtonComponent, IonButton, ExperienceCardComponent,
    SectionHeadingComponent, I18nPipeShortened
  ]
})
export class WorkExperiencePage extends CandidateForm implements OnInit { // I don't know the use of CandidateForm (might be deleted in future sprint)
  form: FormGroup = new FormGroup({})
  displayErrors: { [key: string]: string | undefined; } = {}
  protected override candidate: Candidate = {} as Candidate;
  candidateWorkExperienceEntities: UXWorkExperienceEntity[] = [];

  postLoadProcessing(){
    this.candidateWorkExperienceEntities = this.candidate.workExperienceEntities?.map((workExperience: WorkExperienceEntity) => {
      const existingEntity = this.candidateWorkExperienceEntities?.find((entity) => entity.id === workExperience.id)
      const deleteIsLoadingSubject = existingEntity?.deleteIsLoadingSubject || new BehaviorSubject<boolean>(false);
      const fadeAwaySubject = existingEntity?.fadeAwaySubject || new BehaviorSubject<boolean>(false);
      return {
        ...workExperience,
        deleteIsLoadingSubject,
        deleteIsLoading$: deleteIsLoadingSubject.asObservable(),
        fadeAwaySubject,
        fadeAway$: fadeAwaySubject.asObservable()
      }
    })
    this.cdr.detectChanges()
  }

  constructor(
    private cs:ContentService,
    public router:Router,
    private alertController:AlertController,
    public t: TranslateService,
    private cdr:ChangeDetectorRef
  ) {
    super()
  }

  async ngOnInit() {
    // 1. Load stored data in the cache and remote server
    this.cs.registerCandidateDataObserverV2()
      .subscribe(async (candidate: Candidate|null) => {
        console.log(candidate)
        this.candidate = candidate!
        this.postLoadProcessing()
      })
    /*let extractedData: Candidate|null = await this.cs.candidateData.get();
    this.candidate = extractedData as any;
    this.postLoadProcessing()*/

    // 2. Load the data from the server (onInit only)
    // this.cs.refreshCandidateData() // This function

    // 3. In case of navigation (back from edit/add form), end reload the data from the cache
    /*this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(async () => {
        let extractedData: Candidate|null = await this.cs.candidateData.get();
        this.candidate = extractedData as any;
        this.postLoadProcessing()
      })*/
  }

  async deleteWorkExperience(entity: UXWorkExperienceEntity){
    createDeletePrompt(entity, this.alertController, this.t, this.cs)
      .subscribe(async (response)=>{
        entity.fadeAwaySubject.next(true);
        this.cs.delete_exp(`/api/v2/self-candidate/${this.candidate.candidateId}/delete-work-experience/${entity.id}`, {})
        .pipe(
            catch400Error(this.cs), // Experimental feature
            finalize(()=>{entity.deleteIsLoadingSubject.next(false)}))
          .subscribe(async (response)=>{
            this.cs.requestCandidateDataRefresh() // This will fire data to the ngOnInit code
          })
      })
    /*const alert = await this.alertController.create({
      header: this.t.instant('Confirm'),
      message: this.t.instant('Are you sure you want to delete this entry?'),
      buttons: [
        {
          text: this.t.instant('Cancel'),
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: this.t.instant('Okay'),
          handler: () => {
            entity.fadeAwaySubject.next(true)
            // entity.deleteIsLoadingSubject.next(true) // Unused anymore
            this.cs.delete_exp(`/api/v2/self-candidate/${this.candidate.candidateId}/delete-work-experience/${entity.id}`, {})
            .pipe(
              catch400Error(this.cs), // Experimental feature
              finalize(()=>{entity.deleteIsLoadingSubject.next(false)}))
            .subscribe(async (response)=>{
              // entity.fadeAwaySubject.next(true)
              this.cs.requestCandidateDataRefresh() // This will fire data to the ngOnInit code
            })
          }
        }
      ]
    })
    await alert.present()*/
  }
}
