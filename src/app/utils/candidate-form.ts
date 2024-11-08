import { FormGroup } from "@angular/forms";
import { Candidate } from "../models/Candidate";


export abstract class CandidateForm {
    protected abstract form: FormGroup
    protected abstract displayErrors: {[key:string]:string|undefined}
    protected abstract candidate: Candidate
}