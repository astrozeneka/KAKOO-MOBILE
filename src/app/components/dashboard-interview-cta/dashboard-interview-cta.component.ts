import { Component, OnInit } from '@angular/core';
import { IonButton, IonIcon } from "@ionic/angular/standalone";
import { UploadVideoComponent } from '../upload-video/upload-video.component';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import IFile from 'src/app/models/File';
import { ContentService } from 'src/app/services/content.service';
import { Candidate } from 'src/app/models/Candidate';
import { BehaviorSubject, catchError, finalize, Subject } from 'rxjs';

@Component({
  selector: 'app-dashboard-interview-cta',
  templateUrl: './dashboard-interview-cta.component.html',
  styleUrls: ['./dashboard-interview-cta.component.scss'],
  standalone: true,
  imports: [IonIcon, IonButton, UploadVideoComponent, ReactiveFormsModule]
})
export class DashboardInterviewCtaComponent  implements OnInit {
  form:FormGroup = new FormGroup({
    video: new FormControl<IFile>(null!)
  });
  displayedError:{[key:string]:string|undefined} = {
    video: undefined
  }
  formIsLoading$ = new Subject<boolean>();
  candidate: Candidate = {} as any;

  constructor(
    private cs:ContentService
  ) { }

  ngOnInit() {
    this.cs.registerCandidateDataObserverV3()
      .subscribe((candidate)=>{
        console.log(candidate)
        this.candidate = candidate!;
      })

    
    this.form.valueChanges.subscribe((value)=>{
      // Prepare form data (same code as in welcome.page.ts)
      let fileData = value.video;
      let formData = new FormData();
      try {
        const byteCharacters = atob(fileData.base64.split(',')[1]);
        const byteNumbers = new Array(byteCharacters.length).fill(0).map((_, i) => byteCharacters.charCodeAt(i));
        const byteArray = new Uint8Array(byteNumbers);
        const file = new File([byteArray], fileData.name, { type: fileData.type });
        formData.append('file', file);
      } catch {
        console.log("Cannot fetch data from the file, user hasn't uploaded file probably")
        formData = null as any
      }
      this.formIsLoading$.next(true);
      this.cs.post_exp(`/api/v2/self-candidate/upload-introduction-video/${this.candidate.candidateId}`, formData, {})
        .pipe(catchError((error)=>{
          console.log(error)
          throw error;
        }), finalize(()=>{ this.formIsLoading$.next(false) }))
        .subscribe((response:{code:any,type:any,message:string})=>{
          // The response
          console.log(response)
        })
    })
  }

}
