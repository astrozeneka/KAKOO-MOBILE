import { JsonPipe, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectorRef, Component, ContentChild, EventEmitter, forwardRef, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { ControlContainer, ControlValueAccessor, FormControl, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule, TouchedChangeEvent } from '@angular/forms';
import { IonInput, IonButton, IonIcon } from "@ionic/angular/standalone";
import { filter } from 'rxjs';

@Component({
  selector: 'app-chip-input',
  templateUrl: './chip-input.component.html',
  styleUrls: ['./chip-input.component.scss'],
  standalone: true,
  imports: [IonIcon, IonButton, IonInput, FormsModule, ReactiveFormsModule, JsonPipe, NgTemplateOutlet],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ChipInputComponent),
      multi: true
    }
  ]
})
export class ChipInputComponent<T> implements ControlValueAccessor, OnInit {
  @Input() formControl: FormControl<any[]|string> | undefined;
  @Input() formControlName: string|undefined;
  @Input() label: string = ""
  @Input() placeholder: string = ""
  @Input() options: T[] = []
  @Input() errorText: string | undefined = undefined

  @ViewChild('innerInput') innerInput: IonInput | undefined;

  // Experimental features (blur) event
  @Output() blur: EventEmitter<any> = new EventEmitter();

  // The inner form control and the displayed options
  innerFormControl: FormControl = new FormControl('');
  displayedOption: T[] = [];

  // The key accessor function allow to get the key of the option
  @Input() keyAccessor: (option: T) => string = (option: T) => (option as AsyncGeneratorFunction).toString();

  // Newly introduced feature
  @Input() mode: string = 'multiple' // multiple or single

  // Newly added feature for custom list (e.g. country flag)
  @Input() customList: boolean = false;
  @ContentChild(TemplateRef) itemTemplate: TemplateRef<any> | null = null;

  constructor(
    private controlContainer: ControlContainer,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.formControl = this.formControl || this.controlContainer.control?.get(this.formControlName!) as FormControl<any[]|string>;

    // Manage the inner control value change
    this.innerFormControl.valueChanges.subscribe((value:string) => {
      this._filterOptions(value);
    })

    // On blur mark as touched
    this.innerFormControl.events
      .pipe(filter(event => event instanceof TouchedChangeEvent))
      .subscribe((event:any) => {
        if (event.touched)
          this.formControl?.markAsTouched();
        else
          this.formControl?.markAsUntouched();
        this.blur.emit({}); // Experimental feature
      })
    
    // Sanitize the 'mode' parameter
    if (!(['multiple', 'single']).includes(this.mode)){
      throw new Error("The mode parameter should be either 'multiple' or 'single'");
    }

    // When the inner form is blurred (experimental feature)
    if (this.mode == 'single') { // Maybe another condition is suitable
      this.innerFormControl.valueChanges.subscribe((value) => {
        // Check if one option correspond exactly
        let found:T|undefined = this.options.find(option => this.keyAccessor(option) == value);
        if (found) {
          this.formControl?.setValue(found as any, { emitEvent: false });
        } else {
          console.log("Reset the form " + this.formControlName)
          this.formControl?.setValue('', { emitEvent: false });
        }
        this.blur.emit({});
      })
    }

    // In case of single mode, patch the value to the inner control
    if (this.mode == 'single'){
      this.formControl?.valueChanges.subscribe((value) => {
        this.innerFormControl.patchValue(this.keyAccessor(value as any), {emitEvent: false});
      })
    }
  }

  writeValue(obj: any): void {
    //throw new Error('Method not implemented.');
  }


  onChange: any = () => {};
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  onTouch: any = () => {}; /// onTouched
  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    // TODO later
    //throw new Error('Method not implemented.');
  }

  // 3. Allow it to click an option
  clickOption(option: T) {
    if (this.mode == 'multiple'){
      (this.formControl?.value as any[]).push(option);
    }else if(this.mode == 'single'){
      //this.formControl?.patchValue(this.keyAccessor(option));
      console.log(option)
      this.formControl?.patchValue(option as any, {emitEvent: false});
      // this.innerFormControl.patchValue(this.keyAccessor(option));
    }
    this._filterOptions();
    this.onChange(this.formControl?.value);
    this.onTouch();
    this.innerFormControl.patchValue("", {emitEvent: false});

    // It is mandatory to put the below code here in order to be displayed in the innerForm Control
    if (this.mode == 'single') this.innerFormControl.patchValue(this.keyAccessor(option), {emitEvent: false});
    this.blur.emit({}); // Experimental feature
  }

  // 4. Allow to filter a value from the options
  private _filterOptions(rawValue: string = this.innerFormControl?.value) {
    if (this.mode == 'multiple') {
      this.displayedOption = this.options.filter(
        option => this.keyAccessor(option).toLowerCase().includes(rawValue.toLowerCase()) && !this.formControl?.value.includes(this.keyAccessor(option))
      );
    } else if (this.mode == 'single') {
      /*console.log(this.options)
      console.log(this.options.map((opt)=>this.keyAccessor(opt).toLowerCase()))
      console.log(rawValue.toLowerCase())*/
      if (rawValue == undefined) this.displayedOption = this.options
      else 
        this.displayedOption = this.options.filter(
          option => this.keyAccessor(option).toLowerCase().includes(rawValue.toLowerCase())
        );
    }
  }

  // 5. Allow to remove an option
  removeChip(option: T) {
    if (this.formControl) {
      this.formControl.patchValue((this.formControl.value as any[]).filter((v: T) => v !== option));
    }
    this._filterOptions();
    this.blur.emit({})
    //this.onChange(this.formControl?.value);
    //this.onTouch();
  }

  // 6. The newly added feature
  toggleOptions() {
    console.log(this.innerInput)
    this.innerInput?.setFocus();
    // Put focus on the input
    this.displayedOption = this.options;
    // Add focus to the input
    this.innerFormControl.patchValue('');
  }
}
