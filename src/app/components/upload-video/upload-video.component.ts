import { ChangeDetectorRef, Component, ElementRef, forwardRef, Input, OnInit, ViewChild } from '@angular/core';
import { UxButtonComponent } from 'src/app/submodules/angular-ux-button/standalone/ux-button.component';
import { IonIcon, IonButton } from '@ionic/angular/standalone';
import { ControlContainer, ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ContentService } from 'src/app/services/content.service';
import { Platform } from '@ionic/angular';
import { FilePicker } from '@capawesome/capacitor-file-picker';
import IFile from 'src/app/models/File';
import { Subject } from 'rxjs';
import { I18nPipeShortened } from 'src/app/i18n.pipe';

@Component({
  selector: 'app-upload-video',
  templateUrl: './upload-video.component.html',
  styleUrls: ['./upload-video.component.scss'],
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UploadVideoComponent),
      multi: true,
    },
  ],
  imports: [UxButtonComponent, IonIcon, IonButton, I18nPipeShortened ],
})
export class UploadVideoComponent implements ControlValueAccessor, OnInit {

  @Input() formControl:FormControl<any> | undefined;
  @Input() formControlName: string|undefined;
  @Input() errorText: string | undefined = undefined;
  @ViewChild('fileInput') fileInput: ElementRef|undefined; // The file hidden input
  @Input() loading$:Subject<boolean>|undefined;
  formIsLoading: boolean = false;
  progress = 0;

  private file:IFile = {} as any;

  constructor(
    private http: HttpClient,
    private contentService: ContentService,
    private platform: Platform,
    private controlContainer: ControlContainer,
    private cdr: ChangeDetectorRef
  ) { }
  writeValue(obj: any): void {
    // throw new Error('Method not implemented.');
  }
  registerOnChange(fn: any): void {
    // throw new Error('Method not implemented.');
  }
  registerOnTouched(fn: any): void {
    // throw new Error('Method not implemented.');
  }
  setDisabledState?(isDisabled: boolean): void {
    // throw new Error('Method not implemented.');
  }

  ngOnInit() {
    this.formControl = this.formControl || this.controlContainer.control?.get(this.formControlName!) as FormControl<any[]|string>;

    this.formControl.valueChanges.subscribe((value: any) => {
      if (!value){
        this.progress = 0
      }
    })

    this.loading$?.subscribe((loading)=>{
      this.formIsLoading = loading;
      this.cdr.detectChanges();
    })
  }

  async nativeInputChanged(event:any){
    const file = event.target.files[0];
    // Should load the video using ReadFile and then send it to the serve
    const reader = new FileReader();
    reader.onload = () => {
      const videoData = reader.result;
      this.file = {
        name: file.name,
        type: file.type,
        base64: videoData as any,
        permalink: undefined as any // unused
      }
      this.processVideoUpload();
      this.formControl?.setValue(this.file)
    }
    reader.readAsDataURL(file);
  }

  processVideoUpload(){
    // no need since we already use a control container
    // console.log("Uploading video")
    // The upload is managed by the parent component
  }

  async clickButton(evt:any){
    if (this.platform.is('capacitor')) {
      let result;
      try{
        result = await FilePicker.pickVideos({
          limit: 1,
          readData: true
        })
      }catch(e){
        return;
      }
      if (result['files'].length > 0) { // == 1
        let file = result["files"][0]
        let data = result.files[0].data
        data = "data:" + file.mimeType + ";base64," + data
        this.file = {
          name: file.name,
          type: file.mimeType,
          base64: data,
          permalink: undefined as any // unused
        }
        this.formControl?.setValue(this.file)
      }
      this.processVideoUpload();
    } else {
      this.fileInput?.nativeElement.click();
    }
  }

}
