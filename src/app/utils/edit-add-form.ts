import { ChangeDetectorRef } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { ContentService } from "../services/content.service";
import { Candidate } from "../models/Candidate";


export abstract class EditAddForm<T>{
    // Injected dependencies
    constructor(
        protected route: ActivatedRoute,
        public translate: TranslateService,
        protected cdr: ChangeDetectorRef,
        protected cs: ContentService,
        public router: Router
    ) { }

    // I -- Properties
    public formMode: 'add'|'edit' = 'add';
    public formIsLoading: boolean = false;
    protected candidate: Candidate = {} as any; // Is subjected to priviledge escalation
    entityId: number|undefined = undefined; // Used for edit mode
    deleteIsLoading: boolean = false;

    // II - ABstract properties
    public abstract form: FormGroup;
    public abstract displayedError:{[key:string]:string|undefined};
    protected abstract propertyAccessor: (c:Candidate)=>T[] // Used how to access the poperty
    protected abstract prepareFormData: (e:T)=>T
    protected abstract extractFormData: (e:T)=>T


    // III - Initialization and Methods
    protected async initialize(){ // Must be called within ngOnInit
        // 1. Load the form mode from the get parameter
        this.formMode = this.route.snapshot.queryParamMap.get("mode") as any || 'add';

        // 2. Load the data from cache
        let extractedData: Candidate|null = await this.cs.candidateData.get();
        this.candidate = extractedData as any;
        if (this.formMode == 'edit'){
            this.entityId = parseInt(this.route.snapshot.queryParamMap.get("id")!) as any;
            let entity = this.propertyAccessor(this.candidate).find((v)=>(v as any).id == this.entityId) as any;
            //  let entity = this.candidate.candidateEducationEntities.find((v)=>v.id == this.entityId) as any;
            this.form.patchValue(this.prepareFormData(entity) as any);
        } else {
            this.form.reset();
        }

        // 3. Data fallback from the server (don't need)
        /* this.cs.get_exp(`/api/v2/self-candidate/get-by-id/${this.candidate.candidateId}`, {})
        .pipe(catchError((error)=>{
            // TODO, this pipe should be reused
            if (error.error.status == 400){ // Token invalid
            this.router.navigate(["/login"])
            }
            return throwError(error)
        }))
        .subscribe(async (response)=>{
            // The code below should be reused *** this evening, apply also for education-and-certification page
            this.candidate = response;
            this.cs.candidateData.set(response);
            this.form.patchValue({
            skills: response.skillListEntities.map((skill:any)=>skill.name)
            })
        }) */
    }

    public submit(){
        // Will be implemented very later
        // For now, each inherited class will have their own submit method
    }
}