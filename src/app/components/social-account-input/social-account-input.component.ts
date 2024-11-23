import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlContainer, ControlValueAccessor, FormControl, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { IonIcon, IonButton, IonInput } from "@ionic/angular/standalone";

@Component({
  selector: 'app-social-account-input',
  templateUrl: './social-account-input.component.html',
  styleUrls: ['./social-account-input.component.scss'],
  standalone: true,
  imports: [IonInput, IonIcon, IonButton, FormsModule, ReactiveFormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SocialAccountInputComponent),
      multi: true
    }
  ]
})
export class SocialAccountInputComponent  implements ControlValueAccessor, OnInit {
  @Input() formControl: FormControl<string|null> | undefined;
  @Input() formControlName: string|undefined;
  @Input() label: string = ""
  @Input() placeholder: string = ""
  @Input() errorText: string | undefined = undefined

  // The asset src
  @Input() icon: string = ""

  constructor(
    private controlContainer: ControlContainer,
  ) { }

  ngOnInit() {
    this.formControl = this.formControl || this.controlContainer.control?.get(this.formControlName!) as FormControl<string|null>;
  }

  writeValue(obj: any): void {
    // TODO later
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
  }

  clear(){
    this.formControl?.patchValue('')
  }
}
