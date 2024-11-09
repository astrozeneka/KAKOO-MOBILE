import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton } from '@ionic/angular/standalone';
import { ChipInputComponent } from 'src/app/components/chip-input/chip-input.component';
import { TopbarComponent } from 'src/app/components/topbar/topbar.component';
import { BackButtonComponent } from 'src/app/back-button/back-button.component';
import { Candidate } from 'src/app/models/Candidate';
import { ContentService } from 'src/app/services/content.service';
import { Router } from '@angular/router';
import { catchError, finalize, throwError } from 'rxjs';
import { UxButtonComponent } from "../../submodules/angular-ux-button/standalone/ux-button.component";
import { catch400Error } from 'src/app/utils/catch400Error';

@Component({
  selector: 'app-add-skills',
  templateUrl: './add-skills.page.html',
  styleUrls: ['./add-skills.page.scss'],
  standalone: true,
  imports: [IonButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, ReactiveFormsModule,
    ChipInputComponent, TopbarComponent, BackButtonComponent, UxButtonComponent, UxButtonComponent]
})
export class AddSkillsPage implements OnInit {
  candidate: Candidate = {} as any;

  form:FormGroup = new FormGroup({
    'skills': new FormControl([], [])
  })
  displayedErrors:{[key:string]:string|undefined} = {
    'skills': undefined
  }
  formIsLoading: boolean = false;

  testSkillsFormControl:FormControl = new FormControl([], []);
  displayedErrorTestSkills = undefined;
  testSkillsControlBlur = ()=>{}

  constructor(
    private cs:ContentService,
    private router:Router
  ) { }

  async ngOnInit() {

    // TODO, personal-information should use the registerV2 subscription
    // Waiting for it to have a thorough test first, then begin to implement in this page

    // 1. Load stored data in the cache
    let extractedData: Candidate|null = await this.cs.candidateData.get();

    // 1.a. Patch the data to the form
    extractedData = {
      ...extractedData,
      skills: extractedData?.skillListEntities.map((skill)=>skill.name) || []
    } as any
    this.form.patchValue(extractedData as any);
    this.candidate = extractedData as any;

    // TODO, this evening, cached form, use Inheritance to manage the below codee 
    // 2. Load the data from the server as a fallback of the cached data
    this.cs.get_exp(`/api/v2/self-candidate/get-by-id/${this.candidate.candidateId}`, {})
      .pipe(catch400Error(this.cs)) // Experimental feature
      .subscribe(async (response:any)=>{
        console.log(response)
        // The code below should be reused *** this evening, apply also for education-and-certification page
        this.candidate = response;
        this.cs.candidateData.set(response);
        this.form.patchValue({
          skills: response.skillListEntities.map((skill:any)=>skill.name)
        })
      })
  }

  submit(){
    
    let data = (this.form.value.skills as string[]).map((skill)=>({
        candidateSkillId: null,
        id: null,
        name:skill,
        description: "",
        evaluation: "-",
        nExperience: 0,
        type: "",
        // skillTypeEntity:null
      }));

    // ATTEMPT 3.
    this.formIsLoading = true;
    /*this.cs.patch_exp(`/api/v2/self-candidate/patch-candidate/${this.candidate.candidateId}`, data, {})
      .pipe(catchError((error)=>{
        if (error.error.status == 400){ // Token invalid
          this.router.navigate(["/login"])
        }
        return throwError(error)
      }), finalize(()=>{this.formIsLoading = false;}))
      .subscribe(async (response)=>{
        console.log(response)
      })*/


    // ATTEMPT 2. "Could not commit JPA transaction; nested exception is javax.persistence.RollbackException: Error while committing the transaction"
    /*this.formIsLoading = true;
    this.cs.post_exp('/api/v1/self-candidate/basic-information', data, {})
      .pipe(catchError((error)=>{
        if (error.error.status == 400){ // Token invalid
          this.router.navigate(["/login"])
        }
        return throwError(error)
      }), finalize(()=>{this.formIsLoading = false;}))
      .subscribe(async (response)=>{
        console.log(response)
      })*/


    // ATTEMPT 1. "Could not commit JPA transaction; nested exception is javax.persistence.RollbackException: Error while committing the transaction"
    // This is the old strategy (cannot be used)
    // Cannot deserialize
    this.cs.post_exp(`/api/v1/self-candidate/${this.candidate.candidateId}/technical-skills`, data, {})
      .pipe(
        catch400Error(this.cs), // Experilmental feature
        finalize(()=>{this.formIsLoading = false;}
      ))
      .subscribe((response)=>{
        console.log(response)
        this.router.navigate(["/education-and-certification"])
      })

  }
}
