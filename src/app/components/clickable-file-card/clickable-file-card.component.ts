import { ChangeDetectorRef, Component, ElementRef, forwardRef, Input, OnInit, ViewChild } from '@angular/core';
import { IonButton, IonIcon } from '@ionic/angular/standalone';
import { TranslateService } from '@ngx-translate/core';
import { I18nPipeShortened } from 'src/app/i18n.pipe';
import { Platform } from '@ionic/angular';
import { FilePicker } from '@capawesome/capacitor-file-picker';
import { ControlContainer, ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import IFile from 'src/app/models/File';
// Import json pipe
import { JsonPipe } from '@angular/common';
import { PhoneSelectorComponent } from 'src/app/submodules/phone-selector/phone-selector.component';

@Component({
  selector: 'app-clickable-file-card',
  templateUrl: './clickable-file-card.component.html',
  styleUrls: ['./clickable-file-card.component.scss'],
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ClickableFileCardComponent),
      multi: true
    }
  ],
  imports: [IonButton, IonIcon, I18nPipeShortened, ReactiveFormsModule, JsonPipe]
})
export class ClickableFileCardComponent implements ControlValueAccessor, OnInit {
  @Input() variant: string = "default"
  @ViewChild('fileInput') fileInput: ElementRef = {} as ElementRef;
  file: IFile|null = null // The same as we used in other ionic project

  @Input() formControl: FormControl<any> | undefined;
  @Input() formControlName: string | undefined;

  constructor(
    public translate: TranslateService,
    private platform: Platform,
    private cdr: ChangeDetectorRef,
    private controlContainer: ControlContainer
  ) { }

  writeValue(obj: any): void {
    //throw new Error('Method not implemented.');
  }
  onChange: any = () => {};
  registerOnChange(fn: any): void {
    this.onChange = fn
  }
  onTouch: any = () => {}; /// onTouched
  registerOnTouched(fn: any): void {
    this.onTouch = fn
  }
  setDisabledState?(isDisabled: boolean): void {
    // Unimplemented
  }

  ngOnInit() {
    // This will have an error if the formGroup parent is not none
    // 2. Managing the formControlName parameter
    this.formControl = this.formControl || this.controlContainer.control?.get(this.formControlName!) as FormControl<any[]|string>;

    this.formControl.valueChanges.subscribe((value:any)=>{
      this.file = value
    })
  }

  onNativeFileInputChange(event: any) {
    console.log("preparing file")
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const videoData = reader.result;
      this.file = {
        name: file.name,
        type: file.type,
        base64: videoData
      } as any;
      this.formControl?.setValue(this.file)
      this.cdr.detectChanges()
    }
    reader.readAsDataURL(file);
  }

  async onClick(event: any) {
    event.stopPropagation()
    event.preventDefault()
    if (this.platform.is('capacitor')){
      let result = {} as any;
      try {
        result = await FilePicker.pickFiles({
          limit: 1,
          readData: true
        })
      }catch(e){
        console.error(e)
      }
      if (result['files'].length > 0) {
        const file = result['files'][0];
        this.file = {
          name: file.name,
          type: file.type,
          base64: 'data:' + file.type + ';base64,' + file.data
        } as any;
        this.formControl?.setValue(this.file)
      }
    } else {
      this.fileInput.nativeElement.click()
    }
  }

}
