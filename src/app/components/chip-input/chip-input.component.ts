import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, FormControl, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { IonInput, IonButton, IonIcon } from "@ionic/angular/standalone";

@Component({
  selector: 'app-chip-input',
  templateUrl: './chip-input.component.html',
  styleUrls: ['./chip-input.component.scss'],
  standalone: true,
  imports: [IonIcon, IonButton, IonInput, FormsModule, ReactiveFormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ChipInputComponent),
      multi: true
    }
  ]
})
export class ChipInputComponent<T> implements ControlValueAccessor, OnInit {
  @Input() formControl: FormControl<any[]> | undefined;
  @Input() label: string = ""
  @Input() placeholder: string = ""
  @Input() options: T[] = []

  // The inner form control and the displayed options
  innerFormControl: FormControl = new FormControl('');
  displayedOption: T[] = [];

  // The key accessor function allow to get the key of the option
  @Input() keyAccessor: (option: T) => string = (option: T) => (option as AsyncGeneratorFunction).toString();

  constructor() { }

  ngOnInit() {
    // Manage the inner control value change
    this.innerFormControl.valueChanges.subscribe((value:string) => {
      this._filterOptions(value);
    })
  }

  writeValue(obj: any): void {
    //throw new Error('Method not implemented.');
  }


  onChange: any = () => {};
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  onTouch: any = () => {};
  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    // TODO later
    //throw new Error('Method not implemented.');
  }

  // 3. Allow it to click an option
  clickOption(option: T) {
    this.formControl?.value.push(option);
    this._filterOptions();
    this.onChange(this.formControl?.value);
    this.onTouch();
    this.innerFormControl.patchValue(null);
  }

  // 4. Allow to filter a value from the options
  private _filterOptions(value: string = this.innerFormControl?.value) {
    this.displayedOption = this.options.filter(
      option => this.keyAccessor(option).includes(value) && !this.formControl?.value.includes(option)
    );
  }

  // 5. Allow to remove an option
  removeChip(option: T) {
    if (this.formControl) {
      this.formControl.patchValue(this.formControl.value.filter((v: T) => v !== option));
    }
    this._filterOptions();
    //this.onChange(this.formControl?.value);
    //this.onTouch();
  }
}
