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
import { Router } from '@angular/router';
import { ContentService } from 'src/app/services/content.service';
import { Candidate } from 'src/app/models/Candidate';
import { UploadedFile } from 'src/app/models/File';
import { ClickableFileCardComponent } from 'src/app/components/clickable-file-card/clickable-file-card.component';
import { displayErrors } from 'src/app/utils/display-errors';
import { TranslateService } from '@ngx-translate/core';
import { UxButtonComponent } from 'src/app/submodules/angular-ux-button/standalone/ux-button.component';
import prepareFileFormData from 'src/app/utils/prepare-file-form-data';
import { catchError, finalize, firstValueFrom, throwError } from 'rxjs';
@Component({
  selector: 'app-more-29',
  templateUrl: './more-29.page.html',
  styleUrls: ['./more-29.page.scss'],
  standalone: true,
  imports: [IonInput, IonIcon, IonButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule,
    TopbarComponent, ButtonGroupItemComponent, ProfileCtaComponent, FileCardComponent, FileCardComponent,
    SectionHeadingComponent, BottomNavbarComponent, FormsModule, ReactiveFormsModule, ClickableFileCardComponent,
    UxButtonComponent
  ]
})
export class More29Page extends BottomNavbarTarget implements OnInit { // The class name is subjected to change in the future
  candidate:Candidate = {} as any

  // The resume section
  resumeForm: FormGroup = new FormGroup({
    'file': new FormControl<UploadedFile|null>(null)
  })
  resumeDisplayedError = {
    'file': undefined
  }
  resumeFormChanged: boolean = false
  resumeFormIsLoading:boolean = false // Might be used for the clickable file-card

  constructor(
    router: Router,
    public cs:ContentService,
    private cdr: ChangeDetectorRef,
    private translate: TranslateService
  ) { 
    super(router)
  }

  ngOnInit() {
    // Sync information
    this.cs.registerCandidateDataObserverV3()
      .subscribe((candidate:Candidate|null) => {
        this.candidate = candidate!

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
    

    // Test, might be deleted later
    this.resumeForm.valueChanges.subscribe((value) => {
      if (value) this.resumeFormChanged = true
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
}
