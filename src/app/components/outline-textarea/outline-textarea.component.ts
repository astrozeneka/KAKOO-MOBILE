import { ChangeDetectorRef, Component, forwardRef, Input, OnInit, ViewChild } from '@angular/core';
import { ControlContainer, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { IonTextarea } from '@ionic/angular/standalone';


/**
 * The code is quite similar (but not the same) with outline-input.component.ts
 */
@Component({
  selector: 'app-outline-textarea',
  templateUrl: './outline-textarea.component.html',
  styleUrls: ['./outline-textarea.component.scss'],
  standalone: true,
  imports: [IonTextarea, ReactiveFormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => OutlineTextareaComponent),
      multi: true
    }
  ]
})
export class OutlineTextareaComponent  implements OnInit {
  @Input() formControl: FormControl<string> | undefined;
  @Input() formControlName: string|undefined;
  @Input() placeholder: string = ""
  @Input() errorText: string | undefined = undefined
  @Input() variant: string = "default"

  @ViewChild('innerInput') innerInput: IonTextarea | undefined;
  hasFocus: boolean = false

  constructor(
    private controlContainer: ControlContainer,
    private cdr: ChangeDetectorRef // NO need
  ) { }

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

  setFocus(){
    this.innerInput?.setFocus()
  }
}
