import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IonButton, IonIcon } from '@ionic/angular/standalone';

@Component({
  selector: 'app-filter-chips',
  templateUrl: './filter-chips.component.html',
  styleUrls: ['./filter-chips.component.scss'],
  standalone: true,
  imports: [IonIcon, IonButton],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FilterChipsComponent),
      multi: true
    }
  ]
})
export class FilterChipsComponent  implements OnInit, ControlValueAccessor {

  @Input() items: {[key: string]: string} = {};
  @Input() scrollable: boolean = true;
  keys:string[] = [];

  // 2. Value accessor (incomplete) items
  @Input() formControl: FormControl<string | null> | undefined;

  constructor() {
  }
  writeValue(val: string): void {
    // ????
  }
  onChange: any = () => {};
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  onTouch: any = () => {};
  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  ngOnInit() {
    this.keys = Object.keys(this.items);
  }

  choose(key: string) {
    this.formControl?.setValue(key);
  }

}
