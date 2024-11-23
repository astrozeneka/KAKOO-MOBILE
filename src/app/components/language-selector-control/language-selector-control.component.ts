import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlContainer, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-language-selector-control',
  templateUrl: './language-selector-control.component.html',
  styleUrls: ['./language-selector-control.component.scss'],
  standalone: true,
  imports: [IonButton],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => LanguageSelectorControlComponent),
      multi: true
    }
  ]
})
export class LanguageSelectorControlComponent  implements OnInit {
  @Input() formControl: FormControl<string|null> | undefined;
  @Input() formControlName: string|undefined;

  constructor(
    private controlContainer: ControlContainer
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
}
