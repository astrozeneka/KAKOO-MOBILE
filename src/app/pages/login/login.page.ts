import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonBackButton, IonTitle, IonToolbar, IonItem, IonLabel, IonInput, IonButton, IonIcon } from '@ionic/angular/standalone';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
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
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { catchError, combineLatest, debounce, debounceTime, filter, finalize, map, Observable, of, switchMap, takeUntil, tap, throwError, timer } from 'rxjs';
// Icon icon alert-circle-outline from ionicons
import { alertCircleOutline } from 'ionicons/icons';
import { UxButtonComponent } from 'src/app/submodules/angular-ux-button/standalone/ux-button.component';
import { displayErrors } from 'src/app/utils/display-errors';
import { User, Role } from 'src/app/models/User';
import { TopbarComponent } from 'src/app/components/topbar/topbar.component';
import { OutlineInputComponent } from "../../components/outline-input/outline-input.component";
import { FastSigninComponent as DevFastSigninComponent } from 'src/app/submodules/fast-signin/standalone/fast-signin.component';
import { ProdFastSigninComponent } from 'src/app/submodules/fast-signin/standalone/prod-fast-signin.component';
import { Feedback, FeedbackService } from 'src/app/services/feedback.service';
import { Candidate } from 'src/app/models/Candidate';
import { ProfileDataService } from 'src/app/services/profile-data.service';
import { ProfileUtilsService } from 'src/app/services/profile-utils.service';

export function fireSecondOrFirstAfterDelay<T>(delay: number) {
  return (source: Observable<T>) =>
    new Observable<T>((observer) => {
      let firstData: T | null = null;
      let secondDataReceived = false;

      return source
        .pipe(
          tap((data) => {
            if (firstData === null) {
              firstData = data;
              secondDataReceived = false;
            } else {
              secondDataReceived = true;
              observer.next(data);
              firstData = null; // Reset after second data is emitted
            }
          }),
          switchMap(() =>
            /*secondDataReceived
              ? of(null) // Skip timer if second data already fired
              : timer(delay).pipe(
                  takeUntil(source),
                  tap(() => {
                    if (!secondDataReceived && firstData !== null) {
                      observer.next(firstData);
                      firstData = null;
                    }
                  })
                )*/
            secondDataReceived
              ? of(null)
              : timer(delay).pipe(
                tap((d)=>{
                  console.log("Delay !!!")
                  if (!secondDataReceived && firstData !== null){
                    observer.next(firstData);
                    firstData = null;
                  }
                }))
          )
        )
        .subscribe();
    });
}

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
    OutlineInputComponent, RouterModule
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

  // 5. The error
  error: string = null as any

  // 6. The language
  lang: "en"|"fr" = "en"

  // 7. The feedback
  formErrorFeedbackMessage: string|null = null

  // 8. Check if the user is amidst a login process
  loggingIn: boolean = false

  constructor(
    private router:Router,
    private cs: ContentService,
    public translate: TranslateService,
    private httpClient: HttpClient,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private fs: FeedbackService,
    private pds: ProfileDataService,
    public pus: ProfileUtilsService
  ) {
    super(
      router
    );
    this.lang = (this.translate.currentLang.includes("fr") ? "fr" : "en") as "en"|"fr"
  }

  ngOnInit() {
    // Check active language
    

    // 1.0 - Handle passwordless login
    
    // Feature for a better feedback management (I think it is ok)
    this.form.statusChanges.subscribe((status)=>{
      if (this.form.invalid) {
        displayErrors(this.form, this.displayedError, (v)=>this.translate.instant(v))
        this.cdr.detectChanges()
      }
    })

    // Handle the get 'error' parameter
    // .pipe(filter((e:NavigationEnd)=>this.router.url.includes('/login')))

    this.router.events
      .pipe(filter((e)=>e instanceof NavigationEnd))
      .subscribe((e)=>{
        // Normally, 'pipe' can be used but it is not working (idk why ?)
        if (this.router.url.includes('/login')) {
          this.error = this.route.snapshot.queryParamMap.get('error') as any
          if (this.error == 'session-expired'){
            this.fs.registerNow({
              message: this.translate.instant("Your session has expired. Please login again"),
              type: 'login-feedback' as any
            })
          }
        }
      })
    
    // Handle the feedback
    this.fs.displayFeedback$
      .pipe(filter(e => e?.type == "login-feedback" as any))
      .subscribe((f:Feedback)=>{
        this.formErrorFeedbackMessage = f.message
        this.cdr.detectChanges()
      })

    /*// Handle login success
    this.cs.userData$.subscribe((user:User|null)=>{
      console.log(user)
    })
    this.cs.candidateData$.subscribe((candidate:Candidate|null)=>{
      // In case of candidate is null, it is hasn't candidateId yet
      console.log(candidate)
    })*/

    let round = 0
    combineLatest([this.cs.userData$, this.cs.candidateData$])
      .pipe(fireSecondOrFirstAfterDelay(600))
      .subscribe(([user, candidate])=>{
        if (candidate != null && this.loggingIn){
          let percentage = candidate ? this.pus.calculateProfileCompleteness(candidate!) : 0
          this.loggingIn = false
          // Case 1. No candidate CV
          if (candidate?.resumeAttachmentEntity == null){
            this.router.navigate(['/welcome'])
          }
          // Case 2. Uncompleted profile
          else if (percentage < 1){
            this.router.navigate(['/welcome'])
          }
          // Case 3. Completed profile
          else if (percentage == 1){
            this.router.navigate(['/dashboard'])
          }
          
        }
      })
    /*combineLatest([this.cs.userData$, this.cs.candidateData$])
      .subscribe(([user, candidate])=>{
        // Case 1. Candidate is {}
        if (candidate?.resumeAttachmentEntity){
          console.log("Should upload CV")
        } else {
          
        }
      })*/

    
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
    this.loggingIn = true
    // Test JWT exchange
    this.cs.requestLogin({
      username: this.form.value.email,
      password: this.form.value.password
    })
      .pipe(catchError((error:HttpErrorResponse)=>{
        // Todo, manage Feedback (use the feedback service)
        if (error.status == 0){
          this.fs.registerNow({
            message: this.translate.instant("Connection failed. Please check your internet connection"),
            type: 'login-feedback' as any
          })
        } else if (error.status == 401){
          this.fs.registerNow({
            message: this.translate.instant("Invalid credentials"),
            type: 'login-feedback' as any
          })
        }
        this.credentialFailed = true
        return throwError(error)
      }), finalize(()=>{this.formIsLoading = false}))
      .subscribe((response)=>{
        this.credentialFailed = false
        // Here, redirect the user to the next page

        // First, load the use data using api
        this.cs.requestUserDataRefresh().then(()=>{
          setTimeout(()=>{
            this.cs.requestCandidateDataRefresh()
          }, 200)
        })
        /*this.cs.get_exp('/api/v1/self-candidate/get-user', {}) 
          .subscribe(async (response: User)=>{

            await this.cs.userData.set(response)

            // Another condition will be used, but not the candidateId
            // this.router.navigate(['/welcome'])
            console.log(response)
              
            // Fetch user data
            // Redirect to the next page

            // If not have cv yet


            //
            // Else, redirect to the dashboard
          })*/

      })    
  }

  async loginUsingProvider(provider: string) {
    // 3.0 - Handle login using provider
  }


  // Ionicons
  alertCircleOutline = alertCircleOutline;
}
