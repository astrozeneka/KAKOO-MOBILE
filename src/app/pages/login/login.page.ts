import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonBackButton, IonTitle, IonToolbar, IonItem, IonLabel, IonInput, IonButton, IonIcon } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { AbstractPage } from 'src/app/abstract-page';
import { UXForm } from 'src/app/utils/ux-form';
import { ContentService } from 'src/app/services/content.service';
import { BackButtonComponent } from "../../back-button/back-button.component";
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { I18nPipe, I18nPipeShortened } from 'src/app/i18n.pipe';
import { LanguageButtonComponent } from 'src/app/components/language-button/language-button.component';
import { DevDebugButtonComponent } from "../../dev-prod-components/debug-button/dev-debug-button/dev-debug-button.component";
import { environment } from 'src/environments/environment';
import { ProdDebugButtonComponent } from 'src/app/dev-prod-components/debug-button/prod-debug-button/prod-debug-button.component';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { catchError, map, throwError } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: [
    './login.page.scss',
    '../../stylesheets/login-signup.scss'
  ],
  standalone: true,
  imports: [
    IonIcon, IonButton, IonBackButton, IonInput, IonLabel, IonItem, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, ReactiveFormsModule, BackButtonComponent,
    TranslateModule, I18nPipe, I18nPipeShortened, LanguageButtonComponent,
    ...[(environment.production ? ProdDebugButtonComponent : DevDebugButtonComponent)]
]
})
export class LoginPage extends AbstractPage implements OnInit {

  form: UXForm = new UXForm({
    "email": new FormControl('', [Validators.required, Validators.email]),
    "password": new FormControl('', [Validators.required])
  });

  constructor(
    private router:Router,
    private cs: ContentService,
    public translate: TranslateService,
    private httpClient: HttpClient
  ) {
    super(
      router
    );
    this.translate.setDefaultLang('en');
    // Example, set the language to french
    // this.translate.use('fr');
    /*this.translate.get('HELLO').subscribe((res) => {
      console.log(res)
    })*/


    console.log(translate.getLangs())
  }

  ngOnInit() {

    // 1.0 - Handle passwordless login
    

  }

  async requestLogin() {
    // mark form as touched
    //this.form.markAllAsTouched();
    /*if (this.form.invalid) {
      return;
    }*/
    /*this.cs.post('/request-login', {...this.form.value}).subscribe((res) => {
      console.log(res)
      // 2.1 Here, should store the value inside the local storage using storageObservable

      // 2.2 Depending on the backend, here it is possible that we need to load user data separately

      // 2.3 After that, redirect the user to another page
    });*/


    // Test JWT exchange
    this.httpClient.post('https://web.kakoo-software.com/kakoo-back-end/login', {
      username: 'ryanrasoarahona3@gmail.com',
      password: 'ryanrasoarahona1_'
    }, { observe: 'response'})
      .pipe(catchError((error)=>{
        // if 401
        if (error.status == 401){
          console.log("Unauthorized") // Credential failed
        }
        return throwError(error)
      }))
      .pipe(map((response: HttpResponse<any>)=>{
        // Success
        const token = response.headers.get('Authorization')
        return token
      }))
      .subscribe((response)=>{
        console.log(response)
      })
    
  }

  async loginUsingProvider(provider: string) {
    // 3.0 - Handle login using provider
  }

}
