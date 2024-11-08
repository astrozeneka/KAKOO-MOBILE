import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon } from '@ionic/angular/standalone';
import { TopbarComponent } from 'src/app/components/topbar/topbar.component';
import { BackButtonComponent } from 'src/app/back-button/back-button.component';
import { ExperienceCardComponent } from 'src/app/components/experience-card/experience-card.component';
import { SectionHeadingComponent } from 'src/app/components/section-heading/section-heading.component';
import { CandidateForm } from 'src/app/utils/candidate-form';
import { Candidate, ProjectPortfolioEntity } from 'src/app/models/Candidate';
import { BehaviorSubject, catchError, finalize, Observable, throwError } from 'rxjs';
import { ContentService } from 'src/app/services/content.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {AlertController} from "@ionic/angular";
import { I18nPipeShortened } from 'src/app/i18n.pipe';


interface UXProjectPortfolioEntity extends ProjectPortfolioEntity {
  deleteIsLoadingSubject: BehaviorSubject<boolean>;
  deleteIsLoading$: Observable<boolean>;
  fadeAwaySubject: BehaviorSubject<boolean>;
  fadeAway$: Observable<boolean>;
}

@Component({
  selector: 'app-projects',
  templateUrl: './projects.page.html',
  styleUrls: ['./projects.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, TopbarComponent, BackButtonComponent, IonButton, ExperienceCardComponent, IonIcon,
    SectionHeadingComponent, I18nPipeShortened
  ]
})
export class ProjectsPage extends CandidateForm implements OnInit { // CandidateForm is not needed anymore since ContentService manage the data for us already
  form: FormGroup = new FormGroup({})
  displayErrors: { [key: string]: string | undefined; } = {}
  protected override candidate: Candidate = {} as any;
  candidateProjectEntities: UXProjectPortfolioEntity[] = [];

  postLoadProcessing(){
    this.candidateProjectEntities = this.candidate.projectPortfolioEntities?.map((project: ProjectPortfolioEntity) => {
      const existingEntity = this.candidateProjectEntities?.find((entity) => entity.id === project.id)
      const deleteIsLoadingSubject = existingEntity?.deleteIsLoadingSubject || new BehaviorSubject<boolean>(false);
      const fadeAwaySubject = existingEntity?.fadeAwaySubject || new BehaviorSubject<boolean>(false);
      return {
        ...project,
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

  ngOnInit() {
    // 1. Load stored data from cache and remote server
    this.cs.registerCandidateDataObserverV2()
      .subscribe(async (candidate: Candidate|null) => {
        this.candidate = candidate!
        this.postLoadProcessing()
      })
  }

  async deleteProject(project: UXProjectPortfolioEntity){
    const alert = await this.alertController.create({
      header: this.t.instant('Confirm'),
      message: this.t.instant('Are you sure you want to delete this project?'),
      buttons: [
        {
          text: this.t.instant('Cancel'),
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Cancel clicked');
          }
        }, {
          text: this.t.instant('Okay'),
          handler: () => {
            project.deleteIsLoadingSubject.next(true)
            this.cs.delete_exp(`/api/v2/self-candidate/${this.candidate.candidateId}/delete-project-portfolio/${project.id}`, {})
              .pipe(catchError((error)=>{ // This code should be reused (should be refactored later)
                if (error.error.status == 400){ // Token invalid
                  this.router.navigate(["/login"])
                }
                return throwError(error)
              }), finalize(()=>{project.deleteIsLoadingSubject.next(false)}))
              .subscribe(async (response)=>{
                console.log(response) // Expected to be null
                project.fadeAwaySubject.next(true)
                this.cs.requestCandidateDataRefresh() // This will fire data to the ngOnInit code  
              })
            }
          }
        ]}
      );
    await alert.present();
  }
}
