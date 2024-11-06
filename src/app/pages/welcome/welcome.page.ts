import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonIcon, IonButton } from '@ionic/angular/standalone';
import { FileCardComponent } from 'src/app/components/file-card/file-card.component';
import { ContentService } from 'src/app/services/content.service';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { catchError, map, throwError } from 'rxjs';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: [
    './welcome.page.scss',
    '../../stylesheets/login-signup.scss'
  ],
  standalone: true,
  imports: [IonButton, IonIcon, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, FileCardComponent]
})
export class WelcomePage implements OnInit {
  @ViewChild('fileInput') fileInput: ElementRef = {} as ElementRef;

  constructor(
    private cs: ContentService,
    private httpClient: HttpClient, // To be deleted later
  ) { }

  async ngOnInit() {
    let token = await this.cs.token.get()
    console.log(token)
    // TODO, if token is null disconnect the user

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
    // On change
    this.fileInput.nativeElement.addEventListener('change', (event:any)=>{
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



    // Another Test: Try to fetch CV from the server
    this.httpClient.get('https://web.kakoo-software.com/kakoo-back-end/api/v1/self-candidate/fetch-cv', {
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
      })
  }

}
