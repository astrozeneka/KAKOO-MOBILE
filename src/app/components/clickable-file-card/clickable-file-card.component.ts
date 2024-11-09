import { ChangeDetectorRef, Component, ElementRef, forwardRef, Input, OnInit, ViewChild } from '@angular/core';
import { IonButton, IonIcon } from '@ionic/angular/standalone';
import { TranslateService } from '@ngx-translate/core';
import { I18nPipeShortened } from 'src/app/i18n.pipe';
import { Platform } from '@ionic/angular';
import { FilePicker } from '@capawesome/capacitor-file-picker';
import { ControlContainer, ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import IFile, { UploadedFile } from 'src/app/models/File';
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
  file: UploadedFile|null = null // The same as we used in other ionic project

  @Input() formControl: FormControl<any> | undefined;
  @Input() formControlName: string | undefined;

  // the language
  lang: "en"|"fr" = "en"
  constructor(
    public translate: TranslateService,
    private platform: Platform,
    private cdr: ChangeDetectorRef,
    private controlContainer: ControlContainer
  ) { 
    this.lang = (this.translate.currentLang.includes("fr") ? "fr" : "en") as "en"|"fr"
  }

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

  computeTimeStr(createdAt:string|undefined) {
    if (!createdAt) return "";
    const elapsedMs = Date.now() - new Date(createdAt).getTime();
    const elapsedSeconds = Math.floor(elapsedMs / 1000);
    const elapsedMinutes = Math.floor(elapsedSeconds / 60);
    const elapsedHours = Math.floor(elapsedMinutes / 60);
    const elapsedDays = Math.floor(elapsedHours / 24);
  
    const output = {
      en: '',
      fr: ''
    };
  
    if (elapsedSeconds < 60) {
      output.en = "Added less than a minute ago";
      output.fr = "Ajouté il y a moins d'une minute";
    } else if (elapsedMinutes < 60) {
      output.en = elapsedMinutes === 1 ? "Added one minute ago" : `Added ${elapsedMinutes} minutes ago`;
      output.fr = elapsedMinutes === 1 ? "Ajouté il y a une minute" : `Ajouté il y a ${elapsedMinutes} minutes`;
    } else if (elapsedHours < 24) {
      output.en = elapsedHours === 1 ? "Added one hour ago" : `Added ${elapsedHours} hours ago`;
      output.fr = elapsedHours === 1 ? "Ajouté il y a une heure" : `Ajouté il y a ${elapsedHours} heures`;
    } else {
      output.en = elapsedDays === 1 ? "Added one day ago" : `Added ${elapsedDays} days ago`;
      output.fr = elapsedDays === 1 ? "Ajouté il y a un jour" : `Ajouté il y a ${elapsedDays} jours`;
    }
  
    return output[this.lang];
  }  
  

}
