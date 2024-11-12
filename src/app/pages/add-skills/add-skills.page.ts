import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton } from '@ionic/angular/standalone';
import { ChipInputComponent } from 'src/app/components/chip-input/chip-input.component';
import { TopbarComponent } from 'src/app/components/topbar/topbar.component';
import { BackButtonComponent } from 'src/app/back-button/back-button.component';
import { Candidate, SkillEntity, SkillTypeEntity } from 'src/app/models/Candidate';
import { ContentService } from 'src/app/services/content.service';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, finalize, forkJoin, merge, Observable, switchMap, tap, throwError } from 'rxjs';
import { UxButtonComponent } from "../../submodules/angular-ux-button/standalone/ux-button.component";
import { catch400Error } from 'src/app/utils/catch400Error';
import { displayErrors } from 'src/app/utils/display-errors';
import { TranslateService } from '@ngx-translate/core';

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
    'skills': new FormControl([], [Validators.required])
  })
  displayedErrors:{[key:string]:string|undefined} = {
    'skills': undefined
  }
  formIsLoading: boolean = false;

  testSkillsFormControl:FormControl = new FormControl([], []);
  displayedErrorTestSkills = undefined;
  testSkillsControlBlur = ()=>{}

  // Form options
  skillOptions:SkillEntity[] = [
    /*{id:null, name:"Agriculture", skillTypeEntity:null!},
    {id:null, name:"Architecture", skillTypeEntity:null!},
    {id:null, name:"Art", skillTypeEntity:null!},
    {id:null, name:"IT", skillTypeEntity:null!},*/
  ];
  skillOptionsKeyAccessor = (skill:SkillEntity)=>skill.name;

  constructor(
    private cs:ContentService,
    private router:Router,
    private translate: TranslateService,
    private cdr: ChangeDetectorRef
  ) { }

  async ngOnInit() {


    // TODO, personal-information should use the registerV2 subscription
    // Waiting for it to have a thorough test first, then begin to implement in this page

    // 1. Load stored data in the cache (this is not the good way to load user data)
    /*let extractedData: Candidate|null = await this.cs.candidateData.get();

    // 1.a. Patch the data to the form
    extractedData = {
      ...extractedData,
      skills: extractedData?.skillListEntities.map((skill)=>skill.name) || []
    } as any
    this.form.patchValue(extractedData as any);
    this.candidate = extractedData as any;*/

    // TODO, this evening, cached form, use Inheritance to manage the below codee 
    // 2. Load the data from the server as a fallback of the cached data
    /*this.cs.get_exp(`/api/v2/self-candidate/get-by-id/${this.candidate.candidateId}`, {})
      .pipe(catch400Error(this.cs)) // Experimental feature
      .subscribe(async (response:any)=>{
        console.log(response)
        // The code below should be reused *** this evening, apply also for education-and-certification page
        this.candidate = response;
        this.cs.candidateData.set(response);
        this.form.patchValue({
          skills: response.skillListEntities.map((skill:any)=>skill.name)
        })
      })*/
    
    // Load the data using the new way
    this.cs.registerCandidateDataObserverV3(false, true).subscribe((candidate)=>{
      console.log(candidate)
      this.candidate = candidate!
      console.log(candidate?.skillListEntities)
      this.form.patchValue({
        skills: this.candidate.skillListEntities.map((skill:any)=>{
          return {
            id: skill.id,
            name: skill.name,
            skillTypeEntity: skill.skillTypeEntity
          }
        })
      })
    })
    

    // Loading the skills
    this._loadSkillOptions(false).subscribe((skills)=>{
      this.skillOptions = skills;
      this.cdr.detectChanges();
      console.log(skills)
    })
  }

  private _loadSkillOptions(allowPartial = false): Observable<SkillEntity[]> {
    let outputSubject = new BehaviorSubject<SkillEntity[]>([]);
    let output$ = outputSubject.asObservable();
    
    // Load all skill types
    this.cs.get_exp_fullurl(`https://web.kakoo-software.com/kakoo-back-end/api/v1/skill/get-all-skill-type`, {}, false)
      .pipe(
        catchError((error) => throwError(error)),
        switchMap((skillTypes: SkillTypeEntity[]) => {
          let loaders$ = skillTypes.map(skillType =>
            this.cs.get_exp_fullurl(`https://web.kakoo-software.com/kakoo-back-end/api/v1/skill/get-all-skill?skillTypeId=${skillType.id}`, {}, false)
          );
  
          if (allowPartial) {
            // Emit each response as it arrives
            return merge(...loaders$).pipe(
              tap((partialSkills: SkillEntity[]) => {
                outputSubject.next([...outputSubject.getValue(), ...partialSkills]);
              })
            );
          } else {
            // Wait for all requests to complete
            return forkJoin(loaders$).pipe(
              tap((allSkills: SkillEntity[][]) => {
                const combinedSkills = (allSkills as any).flat();
                outputSubject.next(combinedSkills);
              })
            );
          }
        })
      )
      .subscribe();
  
    return output$;
  }
  

  submit(){
    this.form.markAllAsTouched()
    if (this.form.invalid){
      displayErrors(this.form, this.displayedErrors, (v)=>this.translate.instant(v))
      return;
    }
    // Test, delete this later
    /*let testData = [] as any
    console.log(testData)
    this.cs.post_exp(`/api/v1/self-candidate/${this.candidate.candidateId}/technical-skills`, testData, {})
      .pipe(
        catch400Error(this.cs), // Experilmental feature
        finalize(()=>{this.formIsLoading = false;}
      ))
      .subscribe((response)=>{
        console.log(response)
        //this.router.navigate(["/education-and-certification"])
      })*/

    /// =====================


    //return;
    
    let data = (this.form.value.skills as string[]).map((skill)=>({
        candidateSkillId: null,
        id: null,
        name:(skill as any).name,
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
    console.log(data)
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
