import { AbstractControl, AbstractControlOptions, AsyncValidatorFn, FormGroup, ValidatorFn } from "@angular/forms";


export class UXForm <TControl extends {
    [K in keyof TControl]: AbstractControl<any>;
    } = any> extends FormGroup {
    constructor(
        controls: TControl, validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null, asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null) {
        super(controls, validatorOrOpts, asyncValidator);
    }

    // Is loading
    public isLoading: boolean = false;

    // The displayed error
    public getDisplayedError(key: string): string {
        return "Hello world fro new form system";
    }
}