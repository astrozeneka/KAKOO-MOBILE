import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon, IonInput } from '@ionic/angular/standalone';
import { TopbarComponent } from '../../components/topbar/topbar.component';
import { ButtonGroupItemComponent } from "../../components/button-group-item/button-group-item.component";
import { ProfileCtaComponent } from 'src/app/components/profile-cta/profile-cta.component';
import { FileCardComponent } from "../../components/file-card/file-card.component";
import { SectionHeadingComponent } from 'src/app/components/section-heading/section-heading.component';
import { BottomNavbarComponent } from 'src/app/components/bottom-navbar/bottom-navbar.component';
import { BottomNavbarTarget } from 'src/app/utils/bottom-navbar-target';
import { Router, RouterModule } from '@angular/router';
import { ContentService } from 'src/app/services/content.service';
import { Candidate, CityEntity, CountryEntity } from 'src/app/models/Candidate';
import { UploadedFile } from 'src/app/models/File';
import { ClickableFileCardComponent } from 'src/app/components/clickable-file-card/clickable-file-card.component';
import { displayErrors } from 'src/app/utils/display-errors';
import { TranslateService } from '@ngx-translate/core';
import { UxButtonComponent } from 'src/app/submodules/angular-ux-button/standalone/ux-button.component';
import prepareFileFormData from 'src/app/utils/prepare-file-form-data';
import { catchError, finalize, firstValueFrom, Subject, throwError } from 'rxjs';
import { SvgProfileComponent } from 'src/app/svg-profile/svg-profile.component';
import { ClickableProfileCtaComponent } from 'src/app/components/clickable-profile-cta/clickable-profile-cta.component';
import { I18nPipeShortened } from 'src/app/i18n.pipe';
import { ProfileDataService } from 'src/app/services/profile-data.service';
import Intent from 'src/app/capacitor-plugins/intent.plugin';
import {AlertController} from "@ionic/angular";
import { environment } from 'src/environments/environment';
import { User } from 'src/app/models/User';

@Component({
  selector: 'app-more-29',
  templateUrl: './more-29.page.html',
  styleUrls: ['./more-29.page.scss'],
  standalone: true,
  imports: [IonInput, IonIcon, IonButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule,
    TopbarComponent, ButtonGroupItemComponent, ProfileCtaComponent, FileCardComponent, FileCardComponent,
    SectionHeadingComponent, BottomNavbarComponent, FormsModule, ReactiveFormsModule, ClickableFileCardComponent,
    UxButtonComponent, SvgProfileComponent, ClickableProfileCtaComponent, RouterModule, I18nPipeShortened
  ]
})
export class More29Page extends BottomNavbarTarget implements OnInit { // The class name is subjected to change in the future
  candidate:Candidate = null as any

  // The resume section
  resumeForm: FormGroup = new FormGroup({
    'file': new FormControl<UploadedFile|null>(null)
  })
  resumeDisplayedError = {
    'file': undefined
  }
  resumeFormChanged: boolean = false
  resumeFormIsLoading:boolean = false // Might be used for the clickable file-card

  lang: "en"|"fr" = "en" // Used to translate some dto entities
  cityKeyAccessor = (city: CityEntity) => city?.name;
  countryKeyAccessor = (country: CountryEntity) => country?.name;

  // App version
  appVersion: string|null = null

  // User information
  user: User|null = null

  constructor(
    router: Router,
    public cs:ContentService,
    private cdr: ChangeDetectorRef,
    private translate: TranslateService,
    private pds: ProfileDataService,
    private alertController: AlertController
  ) { 
    super(router)
    this.lang = (this.translate.currentLang.includes("fr") ? "fr" : "en") as "en"|"fr"
  }

  ngOnInit() {
    // Sync information
    this.cs.registerCandidateDataObserverV3()
      .subscribe((candidate:Candidate|null) => {
        this.candidate = candidate!
        console.log(candidate)

        // Patch the resume data
        this.resumeForm.get('file')?.patchValue({
          name: candidate?.resumeAttachmentEntity.name,
          type: candidate?.resumeAttachmentEntity.fileType,
          permalink: candidate?.resumeAttachmentEntity.fullPath,
          createdAt: candidate?.resumeAttachmentEntity.createdAt  
        })
        console.log("===")
        this.resumeFormChanged = false
        this.cdr.detectChanges()
      })
    
    // The user section (test)
    this.cs.registerUserDataObserver()
      .subscribe((user)=>{
        console.log(user)
        this.user = user
      })
    

    // Test, might be deleted later
    this.resumeForm.valueChanges.subscribe((value) => {
      if (value) this.resumeFormChanged = true
    })

    // The app version
    Intent.getAppVersion({}).then((response:{version:string|null})=>{
      console.log(response)
      this.appVersion = response.version
    })
  }

  testEvent(slug:string){
    console.log(slug);
  }

  async resumeSubmit(){ // Might be subjected to changes in the future
    // Validation
    this.resumeForm.markAllAsTouched()
    if (this.resumeForm.invalid) {
      displayErrors(this.resumeForm, this.resumeDisplayedError, (v)=>this.translate.instant(v))
      this.cdr.detectChanges()
      return;
    }

    this.resumeFormIsLoading = true
    let formData:FormData|null = prepareFileFormData(this.resumeForm.get('file')?.value)
    this.cs.post_exp(`/api/v1/self-candidate/upload-resume/candidate-id/${this.candidate.candidateId}`, formData, {})
      .pipe(catchError((error)=>{
        console.error(error)
        return throwError(error)
      }), finalize(()=>{this.resumeFormIsLoading = false}))
      .subscribe((response:{code:any, type:any, message:string})=>{
        console.log(response.message)
        this.cs.requestCandidateDataRefresh();
      })

  }

  async logout(){
    await this.pds.clear();
    this.cs.logout();
  }

  deleteAccount(){
    // Step 1. Present the alert
    let confirmed$ = new Subject()
    this.alertController.create({
      header: this.translate.instant("Are you sure to delete your account?"),
      subHeader: this.translate.instant("The account deletion action is irreversible"),
      buttons: [
        {
          text: this.translate.instant("Cancel"),
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: this.translate.instant("Delete"),
          role: 'delete',
          handler: () => {
            confirmed$.next(true)
          }
        }
      ]
    }).then((alert)=>{
      alert.present()
    })

    // Step 2. Handle account deletion
    confirmed$.subscribe((confirmed)=>{
      if (!confirmed) return;
      console.log("Confirmed")
      this.cs.delete_exp_fullurl(`${environment.apiEndpoint}/api/v1/candidate/delete-candidate/${this.candidate?.candidateId}`, {})
        .pipe(finalize(()=>{
          this.cs.logout() // The API is missing
        }))
        .subscribe((data)=>{
          console.log(data)
        })

    })
  }
}
