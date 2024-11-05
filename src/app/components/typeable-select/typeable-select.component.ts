import { Component, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ChipInputComponent } from '../chip-input/chip-input.component';

@Component({
  selector: 'app-typeable-select',
  templateUrl: './typeable-select.component.html',
  styleUrls: ['./typeable-select.component.scss'],
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ChipInputComponent),
      multi: true
    }
  ]
})
export class TypeableSelectComponent<T> implements ControlValueAccessor, OnInit {
  @Input() formControl: FormControl<any[]> | undefined;
  @Input() label: string = ""
  @Input() placeholder: string = ""
  @Input() options: T[] = []
  @Input() errorText: string | undefined = undefined

  // Experimental features (blur) event (same as for chip-input)
  @Output() blur: EventEmitter<any> = new EventEmitter();

  // The inner form control and the displayed options
  // (the inner value and the component value are different)
  innerFormControl: FormControl = new FormControl('');
  displayedOption: T[] = [];

  // The key accessor function allow to get the key of the option
  @Input() keyAccessor: (option: T) => string = (option: T) => (option as AsyncGeneratorFunction).toString();
  
  constructor() {

    // Manage the inner control value change
  }

  writeValue(obj: any): void {
    throw new Error('Method not implemented.'); // ???
  }
  registerOnChange(fn: any): void {
    throw new Error('Method not implemented.'); // ???
  }
  registerOnTouched(fn: any): void {
    throw new Error('Method not implemented.'); // ???
  }
  setDisabledState?(isDisabled: boolean): void {
    throw new Error('Method not implemented.'); // ???
  }

  ngOnInit() {}

}
