import { AfterViewInit, ChangeDetectorRef, Component, forwardRef, Input, OnInit, ViewChild } from '@angular/core';
import { ControlContainer, ControlValueAccessor, FormControl, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { IonInput } from '@ionic/angular/standalone';

@Component({
  selector: 'app-outline-input',
  templateUrl: './outline-input.component.html',
  styleUrls: ['./outline-input.component.scss'],
  standalone: true,
  imports: [IonInput, FormsModule, ReactiveFormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => OutlineInputComponent),
      multi: true
    }
  ]
})
export class OutlineInputComponent  implements ControlValueAccessor, OnInit, AfterViewInit {
  @Input() formControl: FormControl<string> | undefined;
  @Input() formControlName: string|undefined;
  @Input() label: string = ""
  @Input() placeholder: string = ""
  @Input() errorText: string | undefined = undefined

  @ViewChild('innerInput') innerInput: IonInput | undefined;
  hasFocus: boolean = false

  constructor(
    private controlContainer: ControlContainer,
    private cdr: ChangeDetectorRef // NO need
  ) { 
  }

  ngOnInit() {
    this.formControl = this.formControl || this.controlContainer.control?.get(this.formControlName!) as FormControl<string>;
  }

  ngAfterViewInit(){
    // 1. Managing the focus/blur
    // On focus of the innerInput
    this.innerInput?.ionFocus.subscribe(() => {
      this.hasFocus = true
    })
    // Blur
    this.innerInput?.ionBlur.subscribe(() => {
      this.hasFocus = false
    })
  }

  writeValue(obj: any): void {
    // throw new Error('Method not implemented.');
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
    // throw new Error('Method not implemented.');
  }

}
