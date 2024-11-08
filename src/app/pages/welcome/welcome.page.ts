import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonIcon, IonButton } from '@ionic/angular/standalone';
import { FileCardComponent } from 'src/app/components/file-card/file-card.component';
import { ContentService } from 'src/app/services/content.service';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { catchError, finalize, map, throwError } from 'rxjs';
import { ClickableFileCardComponent } from 'src/app/components/clickable-file-card/clickable-file-card.component';
import { Candidate } from 'src/app/models/Candidate';
import { UxButtonComponent } from 'src/app/submodules/angular-ux-button/standalone/ux-button.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: [
    './welcome.page.scss',
    '../../stylesheets/login-signup.scss'
  ],
  standalone: true,
  imports: [IonButton, IonIcon, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, FileCardComponent,
    ClickableFileCardComponent, ReactiveFormsModule, UxButtonComponent
  ]
})
export class WelcomePage implements OnInit {
  @ViewChild('fileInput') fileInput: ElementRef = {} as ElementRef; // Unused, will be deleted later
  form: FormGroup = new FormGroup({
    'file': new FormControl(null)
  })
  formIsLoading:boolean = false

  constructor(
    private cs: ContentService,
    private httpClient: HttpClient, // To be deleted later
    private router: Router
  ) { }

  async ngOnInit() {
    let token = await this.cs.token.get()
    console.log(token)
    // TODO, if token is null disconnect the user

    // Testing formControl (test passed)
    /* setTimeout(()=>{
      this.fileControl.setValue({
        name: "Test file",
        type: "application/pdf"
      })
    }, 1000);*/

    // Communication test to the upload-cv endpoint to upload a cv
    /*this.httpClient.post('https://web.kakoo-software.com/kakoo-back-end/api/v1/self-candidate/create-from-cv', {
      // To fill later
    }, {
      headers: { 
        'Content-Type': 'multipart/form-data',
        // add authorization token
        'Authorization': token as string
      },

    })
    .pipe(catchError((error)=>{
      console.log(error)
      return throwError(error)
    }))
    .subscribe((response)=>{
      console.log(response)
    })*/

    // Test viewchild
    console.log(this.fileInput)
    // On change (the code below doesn't run)
    this.fileInput?.nativeElement.addEventListener('change', (event:any)=>{
      // Get the value of the file
      let file = this.fileInput.nativeElement.files![0]
      // Read as binary
      let reader = new FileReader()
      reader.onload = (event)=>{
        let result = reader.result
        console.log("Sending post request")
        // Try to send the file to the server
        this.httpClient.post('https://web.kakoo-software.com/kakoo-back-end/api/v1/self-candidate/create-from-cv', result, {
          headers: { 
            'Content-Type': 'multipart/form-data',
            // add authorization token
            'Authorization': token as string,
          },
          observe: 'response'
        })
        .pipe(map((response:HttpResponse<any>)=>{
          // Print headers
          console.log(response.headers)
          // Print as json

        }))
        .pipe(catchError((error)=>{
          console.log(error)
          return throwError(error)
        }))
        .subscribe((response)=>{
          console.log("Uploaded")
          console.log(response)
        })
      }
      reader.readAsDataURL(file)
    })



    // Another Test: Try to fetch CV from the server (the code below doesn't work)
    /*this.httpClient.get('https://web.kakoo-software.com/kakoo-back-end/api/v1/self-candidate/fetch-cv', {
      headers: { 
        // 'Content-Type': 'multipart/form-data', undeeded
        // add authorization token
        'Authorization': token as string
      },
    })
      .pipe(catchError((error)=>{
        console.log(error)
        return throwError(error)
      }))
      .subscribe((response)=>{
        console.log(response)
      })*/
  }

  async submit(){
    const fileData = this.form.get('file')?.value
    // testing a file sending, this should use the get_exp (experimental first)
    
    // a. Preparing fileData
    const byteCharacters = atob(fileData.base64.split(',')[1]);
    const byteNumbers = new Array(byteCharacters.length).fill(0).map((_, i) => byteCharacters.charCodeAt(i));
    const byteArray = new Uint8Array(byteNumbers);
    const file = new File([byteArray], fileData.name, { type: fileData.type });
    const formData = new FormData();
    formData.append('file', file);

    // b. Preparing query
    let token = await this.cs.token.get()
    const headers = new HttpHeaders({
      'Authorization': token!
    })
    this.formIsLoading = true
    let url = 'https://web.kakoo-software.com/kakoo-back-end/api/v1/self-candidate/create-from-cv'
    this.httpClient.post(url, formData, { headers })
    .pipe(catchError((error)=>{
      return throwError(error)
    }), finalize(()=>{this.formIsLoading = false}))
    .subscribe(async (response:any)=>{
      let candidate = response as Candidate
      await this.cs.candidateData.set(candidate)
      console.log("Store candidate data to the local storage")
      // After that, use a Stored Data (experimental) to store the candidate info in the client app
      this.router.navigate(['/personal-information'])

      // Finally, redirect to the next page (personal-information)
    })
  }

}
