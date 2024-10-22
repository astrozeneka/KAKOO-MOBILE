import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, FormControl, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
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
  @Input() formControl: FormControl<string|null> = new FormControl('');
  @Input() label: string = ""
  @Input() placeholder: string = ""
  @Input() errorText: string | undefined = undefined

  constructor() { }

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

  ngOnInit() {}

  clear(){
    this.formControl.patchValue('')
  }
}
