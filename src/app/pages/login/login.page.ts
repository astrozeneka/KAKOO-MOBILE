import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
import { catchError, finalize, map, throwError } from 'rxjs';
// Icon icon alert-circle-outline from ionicons
import { alertCircleOutline } from 'ionicons/icons';
import { UxButtonComponent } from 'src/app/submodules/angular-ux-button/standalone/ux-button.component';
import { displayErrors } from 'src/app/utils/display-errors';
import { User, Role } from 'src/app/models/User';
import { TopbarComponent } from 'src/app/components/topbar/topbar.component';
import { OutlineInputComponent } from "../../components/outline-input/outline-input.component";
import { FastSigninComponent as DevFastSigninComponent } from 'src/app/submodules/fast-signin/standalone/fast-signin.component';
import { ProdFastSigninComponent } from 'src/app/submodules/fast-signin/standalone/prod-fast-signin.component';

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
    TranslateModule, I18nPipe, I18nPipeShortened, LanguageButtonComponent, UxButtonComponent, TopbarComponent,
    ...[(environment.production ? ProdDebugButtonComponent : DevDebugButtonComponent)],
    ...[(environment.production ? ProdFastSigninComponent : DevFastSigninComponent)],
    OutlineInputComponent
]
})
export class LoginPage extends AbstractPage implements OnInit {

  form: UXForm = new UXForm({ // This is a good tool to develop in a new projects (should put it in a new experimental branch)
    "email": new FormControl('', [Validators.required, Validators.email]),
    "password": new FormControl('', [Validators.required])
  });
  displayedError: {[key:string]:string|undefined} = {
    "email": undefined,
    "password": undefined
  }

  // 3. Loading UX
  formIsLoading: boolean = false
  
  // 4. To display if the credential failed or not
  credentialFailed: boolean = false

  constructor(
    private router:Router,
    private cs: ContentService,
    public translate: TranslateService,
    private httpClient: HttpClient,
    private cdr: ChangeDetectorRef
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
    
    // Feature for a better feedback management (I think it is ok)
    this.form.statusChanges.subscribe((status)=>{
      if (this.form.invalid) {
        displayErrors(this.form, this.displayedError, (v)=>this.translate.instant(v))
        this.cdr.detectChanges()
      }
    })

  }

  async requestLogin() {
    // mark form as touched
    this.form.markAllAsTouched()
    if (this.form.invalid){
      displayErrors(this.form, this.displayedError, (v)=>this.translate.instant(v))
      this.cdr.detectChanges()
      return;
    }
    this.formIsLoading = true
    
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

    this.formIsLoading = true
    // Test JWT exchange
    this.cs.requestLogin({
      username: this.form.value.email,
      password: this.form.value.password
    })
      .pipe(catchError((error)=>{
        // Todo, manage Feedback (use the feedback service)
        this.credentialFailed = true
        console.error("Credential failed")
        return throwError(error)
      }), finalize(()=>{this.formIsLoading = false}))
      .subscribe((response)=>{
        this.credentialFailed = false
        // Here, redirect the user to the next page

        // First, load the use data using api
        this.cs.get_exp('/api/v1/self-candidate/get-user', {}) 
          .subscribe((response: User)=>{
            if(!response.candidateId || false){
              this.router.navigate(['/welcome'])
            }else{
              this.router.navigate(['/dashboard'])
            }
            // Fetch user data
            // Redirect to the next page

            // If not have cv yet


            //
            // Else, redirect to the dashboard
          })

      })    
  }

  async loginUsingProvider(provider: string) {
    // 3.0 - Handle login using provider
  }


  // Ionicons
  alertCircleOutline = alertCircleOutline;
}
