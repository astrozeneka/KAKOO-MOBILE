import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonIcon, IonButton } from '@ionic/angular/standalone';
import { ExperienceCardComponent } from 'src/app/components/experience-card/experience-card.component';
import { SectionHeadingComponent } from "../../components/section-heading/section-heading.component";
import { TopbarComponent } from 'src/app/components/topbar/topbar.component';
import { BackButtonComponent } from 'src/app/back-button/back-button.component';
import { I18nPipeShortened } from 'src/app/i18n.pipe';
import { Candidate, CandidateCertificateEntity, CandidateEducationEntity, EducationCertificateEntity } from 'src/app/models/Candidate';
import { ContentService } from 'src/app/services/content.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import {AlertController} from "@ionic/angular";
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, catchError, filter, finalize, Observable, throwError } from 'rxjs';
import { CandidateForm } from 'src/app/utils/candidate-form';
import { catch400Error } from 'src/app/utils/catch400Error';

interface UXCandidateEducationEntity extends CandidateEducationEntity {
  deleteIsLoadingSubject: BehaviorSubject<boolean>;
  deleteIsLoading$: Observable<boolean>;
  fadeAwaySubject: BehaviorSubject<boolean>;
  fadeAway$: Observable<boolean>;
}

interface UXCandidateCertificateEntity extends CandidateCertificateEntity { // TODO later
  deleteIsLoadingSubject: BehaviorSubject<boolean>;
  deleteIsLoading$: Observable<boolean>;
  fadeAwaySubject: BehaviorSubject<boolean>;
  fadeAway$: Observable<boolean>;
}

@Component({
  selector: 'app-education-and-certification',
  templateUrl: './education-and-certification.page.html',
  styleUrls: ['./education-and-certification.page.scss'],
  standalone: true,
  imports: [IonButton, IonIcon, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,
    ExperienceCardComponent, SectionHeadingComponent, TopbarComponent, BackButtonComponent, I18nPipeShortened]
})
export class EducationAndCertificationPage extends CandidateForm implements OnInit { // CandidateForm is not needed anymore since ContentService manage the data for us already
  form: FormGroup = new FormGroup({})
  displayErrors: { [key: string]: string | undefined; } = {}
  protected override candidate: Candidate = {} as any;
  candidateEducationEntities: UXCandidateEducationEntity[] = [];
  candidateCertificateEntities: UXCandidateCertificateEntity[] = []; // TODO Later

  postLoadProcessing(){
    this.candidateEducationEntities = this.candidate.candidateEducationEntities?.map((education: CandidateEducationEntity) => {
      const existingEntity = this.candidateEducationEntities?.find((entity) => entity.id === education.id)
      const deleteIsLoadingSubject = existingEntity?.deleteIsLoadingSubject || new BehaviorSubject<boolean>(false);
      const fadeAwaySubject = existingEntity?.fadeAwaySubject || new BehaviorSubject<boolean>(false);
      return {
        ...education,
        deleteIsLoadingSubject,
        deleteIsLoading$: deleteIsLoadingSubject.asObservable(),
        fadeAwaySubject,
        fadeAway$: fadeAwaySubject.asObservable()
      }
    })
    this.candidateCertificateEntities = this.candidate.candidateCertificateEntities?.map((certificate: CandidateCertificateEntity) => {
      const existingEntity = this.candidateCertificateEntities?.find((entity) => entity.id === certificate.id)
      const deleteIsLoadingSubject = existingEntity?.deleteIsLoadingSubject || new BehaviorSubject<boolean>(false);
      const fadeAwaySubject = existingEntity?.fadeAwaySubject || new BehaviorSubject<boolean>(false);
      return {
        ...certificate,
        deleteIsLoadingSubject,
        deleteIsLoading$: deleteIsLoadingSubject.asObservable(),
        fadeAwaySubject,
        fadeAway$: fadeAwaySubject.asObservable()
      }
    })
    this.cdr.detectChanges()
    
    /*this.candidateEducationEntities = this.candidate.candidateEducationEntities.map((education: CandidateEducationEntity) => {
      const deleteIsLoadingSubject = new BehaviorSubject<boolean>(false);
      return {
        ...education,
        deleteIsLoadingSubject,
        deleteIsLoading$: deleteIsLoadingSubject.asObservable()
      };
    });
    this.cdr.detectChanges()*/
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
        console.log("Load candidate from the service")
        this.candidate = candidate!
        this.postLoadProcessing()  
      })
      

    // 1. Load stored data in the cache
    /*let extractedData: Candidate|null = await this.cs.candidateData.get();
    this.candidate = extractedData as any;
    this.postLoadProcessing()*/
    // Append the behavior Subject
    /*for(let i=0; i<this.candidate.candidateCertificateEntities.length; i++){
      this.candidate.candidateCertificateEntities[i].deleteEducationIsLoadingSubject = new BehaviorSubject<boolean>(false);
      this.candidate.candidateCertificateEntities[i].deleteEducationIsLoading$ = this.candidate.candidateCertificateEntities[i].deleteEducationIsLoadingSubject.asObservable();
    }*/
    
    // This will be a feedback
    
    
    
    //this.refreshCandidateData()

    // 2. The navigation end event (no need anymore, the contentService already manage this for us by the registerCandidateDataObserverV2 function)
    /*this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(()=>{
        this.refreshCandidateData()
      }) */
  }

  // Move into the parent class later (replaced by a content service), will be deleted later
  /*refreshCandidateData(){
    this.cs.get_exp(`/api/v2/self-candidate/get-by-id/${this.candidate.candidateId}`, {})
    .pipe(catchError((error)=>{
      if (error.error.status == 400){ // Token invalid
        this.router.navigate(["/login"])
      }
      return throwError(error)
    }))
    .subscribe(async (response)=>{
      console.log(response)
      // The code below should be reused *** this evening, apply also for education-and-certification page
      this.candidate = response;
      this.cs.candidateData.set(response);
      this.form.patchValue({
        skills: response.skillListEntities.map((skill:any)=>skill.name)
      })
      // Code as in feedback
      this.postLoadProcessing()
      console.log(this.candidateEducationEntities)
      this.cdr.detectChanges()
    })
  }*/

  async deleteEducation(entity:UXCandidateEducationEntity){
    const alert = await this.alertController.create({
      header: this.t.instant("Confirm"),
      message: this.t.instant("Are you sure you want to delete this entry?"),
      buttons: [
        {
          text: this.t.instant("Cancel"),
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: this.t.instant("Okay"),
          handler: () => {
            entity.fadeAwaySubject.next(true)
            // entity.deleteIsLoadingSubject.next(true); // Unused anymore
            this.cs.delete_exp(`/api/v2/self-candidate/${this.candidate.candidateId}/delete-education/${entity.id}`, {})
              .pipe(
                catch400Error(this.cs), // Experimental feature
                finalize(()=>{entity.deleteIsLoadingSubject.next(false)}))
              .subscribe(async (response)=>{
                entity.fadeAwaySubject.next(true)
                this.cs.requestCandidateDataRefresh() // This will fire data to the ngOnInit code
              })
          }
        }
      ]
    });
    await alert.present();
  }

  async deleteCertificate(entity:UXCandidateCertificateEntity){
    const alert = await this.alertController.create({
      header: this.t.instant("Confirm"),
      message: this.t.instant("Are you sure you want to delete this entry?"),
      buttons: [
        {
          text: this.t.instant("Cancel"),
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: this.t.instant("Okay"),
          handler: () => {
            entity.fadeAwaySubject.next(true)
            // entity.deleteIsLoadingSubject.next(true); // Unused anymore
            this.cs.delete_exp(`/api/v2/self-candidate/${this.candidate.candidateId}/delete-certificate/${entity.id}`, {})
              .pipe(
                catch400Error(this.cs), // Experimental feature
                finalize(()=>{entity.deleteIsLoadingSubject.next(false)}))
              .subscribe(async (response)=>{
                entity.fadeAwaySubject.next(true)
                this.cs.requestCandidateDataRefresh() // This will fire data to the ngOnInit code
              })
          }
        }
      ]
    });
    await alert.present();
  }

  submit(){

  }
}
