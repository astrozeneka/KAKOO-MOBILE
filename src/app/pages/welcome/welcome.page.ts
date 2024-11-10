import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonIcon, IonButton } from '@ionic/angular/standalone';
import { FileCardComponent } from 'src/app/components/file-card/file-card.component';
import { ContentService } from 'src/app/services/content.service';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { catchError, filter, finalize, firstValueFrom, map, throwError } from 'rxjs';
import { ClickableFileCardComponent } from 'src/app/components/clickable-file-card/clickable-file-card.component';
import { Candidate } from 'src/app/models/Candidate';
import { UxButtonComponent } from 'src/app/submodules/angular-ux-button/standalone/ux-button.component';
import { NavigationEnd, Router } from '@angular/router';
import { catch400Error } from 'src/app/utils/catch400Error';
import { UploadedFile } from 'src/app/models/File';
import { User } from 'src/app/models/User';
import { I18nPipeShortened } from 'src/app/i18n.pipe';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: [
    './welcome.page.scss',
    '../../stylesheets/login-signup.scss'
  ],
  standalone: true,
  imports: [IonButton, IonIcon, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, FileCardComponent,
    ClickableFileCardComponent, ReactiveFormsModule, UxButtonComponent, I18nPipeShortened
  ]
})
export class WelcomePage implements OnInit {
  @ViewChild('fileInput') fileInput: ElementRef = {} as ElementRef; // Unused, will be deleted later
  form: FormGroup = new FormGroup({
    'file': new FormControl(null)
  })
  formIsLoading:boolean = false

  // The candidate information
  candidate: Candidate|null = null

  // The user information (since the candidate might be null)
  user: User|null = null

  postLoadProcessing(){
    if (this.candidate?.resumeAttachmentEntity){
      console.log(this.candidate.resumeAttachmentEntity)
      let file = {
        name: this.candidate.resumeAttachmentEntity.name,
        type: this.candidate.resumeAttachmentEntity.fileType,
        permalink: this.candidate.resumeAttachmentEntity.fullPath,
        createdAt: this.candidate.resumeAttachmentEntity.createdAt
      } as UploadedFile
      this.form.get('file')?.setValue(file)
    } else {
      console.log("No CV file found")
      this.form.get('file')?.setValue(null)
      this.cdr.detectChanges()
    }
  }

  constructor(
    private cs: ContentService,
    private httpClient: HttpClient, // To be deleted later
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  async ngOnInit() {
    let token = await this.cs.token.get()
    console.log(token)

    // KNOWN BUG 1. Priority: Low
    // The user log in with a use with CV uploaded account, then disconnect
    // When he reconnect, the CV of former account is still displayed
    this.cs.registerCandidateDataObserverV3(false, true)
      .subscribe((candidate: Candidate|null) => {
        // It is not fired the first time the user uses his account
        // If the user has just been connected, this will not be triggered
        // The userData will be used instead
        this.candidate = candidate!
        console.log(candidate)
        this.postLoadProcessing()
      })
    
    // For performance, only from server is loaded ONCE (not from cache)
    this.cs.registerUserDataObserver(false, true) //
      .subscribe((userData: User|null) =>{
        this.user = userData
        setTimeout(()=>{
          this.cs.requestCandidateDataRefresh()
        }, 1000);
      })
    
    // The subscription below is not the same as above, since here we allow to load from the cache
    this.cs.registerUserDataObserver(true, false)
      .subscribe((userData: User|null) =>{
        this.user = userData
      })
    
    
    
    // Experimental feature, load the user data once he is back to the page
    // Doesn't work since we don't have candidate id at this stage
    this.router.events // May be deleted
      .pipe(filter((event) => event instanceof NavigationEnd && event.url == '/welcome'))
      .subscribe(async () => {
        console.log("User is back to the page")
        this.candidate = null
        this.postLoadProcessing()
        // this.cs.requestCandidateDataRefresh()
      })


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
    /*console.log(this.fileInput)
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
    })*/



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
    let formData = new FormData();
    try{
      const byteCharacters = atob(fileData.base64.split(',')[1]);
      const byteNumbers = new Array(byteCharacters.length).fill(0).map((_, i) => byteCharacters.charCodeAt(i));
      const byteArray = new Uint8Array(byteNumbers);
      const file = new File([byteArray], fileData.name, { type: fileData.type });
      formData.append('file', file);
    }catch(error){
      console.log("Cannot fetch data from the file, user hasn't uploaded file probably")
      formData = null as any
    }


    // THe below query should be changed into away sequences for more readabil0ity

    // Step 1. Send the file to the server to extract data
    let candidate:Candidate = null as any;
    if (formData){
      console.log("(1/3) Sending file to the server for extrsacting information")
      this.formIsLoading = true;
      candidate = await (()=>{
        try {
          return firstValueFrom(this.cs.post_exp(`/api/v1/self-candidate/create-from-cv`, formData, {}))
        } catch (error) {
          return throwError(error)
        }
      })();
      this.formIsLoading = false
      this.cs.candidateData.set(candidate)
    } else {
      console.log("(1/3) CV file not set, skipping sending file to the server, directly skipping to the next step")
      this.form.get('file')?.setValue(null) // (no need) Try to remove the file-card information,  (doesn't work)
      this.router.navigate(['/personal-information']);
    }

    // Step 2. Once submitted and success, save the basic information to the server
    let registeredCandidate:Candidate|null = null;
    if (formData && candidate){
      console.log("(2/3) Saving basic information to the server")
      registeredCandidate = await (()=>{ // Experimental feature
        this.formIsLoading = true
        try {
          return firstValueFrom(this.cs.post_exp(`/api/v1/self-candidate/basic-information`, 
            {
              ...candidate,
              countryEntity: null,
              stateEntity: null,
              cityEntity: null
            }, {}))
        } catch (error) {
          return throwError(error)
        }
      })();
      this.formIsLoading = false
      this.cs.candidateData.set(registeredCandidate!)
    }else{
      console.log("(2/3) Skipping saving basic information to the server, candidate Data is not available")
    }

    
    // Step 3. Once Finished, Save the file ID to the server (since it require the candidateId)
    if (registeredCandidate?.candidateId){
      console.log("(3/3) Saving the file ID to the server")
      let postResponse:any = await (()=>{ // Experimental feature
        this.formIsLoading = true;
        try {
          return firstValueFrom(this.cs.post_exp(`/api/v1/self-candidate/upload-resume/candidate-id/${registeredCandidate.candidateId}`, formData, {}))
        } catch (error) {
          return throwError(error)
        }
      })();
      this.formIsLoading = false

      this.form.get('file')?.setValue(null) // Try to remove the file-card information (doesn't work)
      // Finally, navigate to the next page
      this.router.navigate(['/personal-information']);
    }else{
      console.error("(3/3) Skipping File upload, Candidate ID is not found")
    }


    // b. Preparing query
    /*console.log("Preparing query")
    let token = await this.cs.token.get()
    const headers = new HttpHeaders({
      'Authorization': token!
    })
    this.formIsLoading = true
    this.httpClient.post('https://web.kakoo-software.com/kakoo-back-end/api/v1/self-candidate/create-from-cv', formData, { headers })
    .pipe(catchError((error)=>{
      return throwError(error)
    }), finalize(()=>{this.formIsLoading = false}))
    .subscribe(async (response:any)=>{
      let candidate = response as Candidate
      console.log(candidate)
      await this.cs.candidateData.set(candidate)
      console.log("Store candidate data to the local storage")

      /*
      // Once submitted and success, save the basic information to the server
      let registeredCandidate:Candidate = await (()=>{ // Experimental feature
        this.formIsLoading = true
        try {
          return firstValueFrom(this.cs.post_exp(`/api/v1/self-candidate/basic-information`, 
            {
              ...candidate,
              countryEntity: null,
              stateEntity: null,
              cityEntity: null
            }, {}))
        } catch (error) {
          return throwError(error)
        } finally {
          this.formIsLoading = false
        }
      })();
      
      // Once Finished, Save the file ID to the server (since it require the candidateId)
      if (registeredCandidate?.candidateId){
        let postResponse:any = await (()=>{ // Experimental feature
          this.formIsLoading = true;
          try {
            return firstValueFrom(this.cs.post_exp(`/api/v1/self-candidate/upload-resume/candidate-id/${registeredCandidate.candidateId}`, formData, {}))
          } catch (error) {
            return throwError(error)
          } finally {
            this.formIsLoading = false
          }
        })();

        // Finally, navigate to the next page
        this.router.navigate(['/personal-information']);
      }
      */

      // Save the basic information first (in order to fetch the candidateId)
      /*this.formIsLoading = true
      this.cs.post_exp(`/api/v1/self-candidate/basic-information`, 
        {
          ...candidate,
          countryEntity: null,
          stateEntity: null,
          cityEntity: null
        }, {})
        .pipe(
          catch400Error(this.cs), // Experimental feature
          finalize(()=>{this.formIsLoading = false})
        )
        .subscribe(async(registeredCandidate: Candidate)=>{

          this.cs.candidateData.set(registeredCandidate)
          console.log(registeredCandidate);


          / Once Finished, Save the file ID to the server (since it require the candidateId)
          let postResponse:any = await (()=>{
            this.formIsLoading = true;
            try {
              return firstValueFrom(this.cs.post_exp(`/api/v1/self-candidate/upload-resume/candidate-id/${registeredCandidate.candidateId}`, formData, {}))
            } catch (error) {
              return throwError(error)
            } finally {
              this.formIsLoading = false
            }
          })();

          // Finally, navigate to the next page
          this.router.navigate(['/personal-information'])*/
          
          /*this.formIsLoading = true
          let candidateId = registeredCandidate.candidateId
          //this.cs.post_exp(`/api/v1/self-candidate/${candidateId}/upload-cv`, formData, {})
          this.cs.post_exp(`/api/v1/self-candidate/upload-resume/candidate-id/${candidateId}`, formData, {})
            .pipe(catchError((error)=>{
              return throwError(error)
            }), finalize(()=>{this.formIsLoading = false}))
            .subscribe((response:any)=>{
              console.log("Done")
              console.log(response)
              this.router.navigate(['/personal-information'])
            })



        })*/

      // After that, use a Stored Data (experimental) to store the candidate info in the client app
      // this.router.navigate(['/personal-information'])
    //})
  }

}
