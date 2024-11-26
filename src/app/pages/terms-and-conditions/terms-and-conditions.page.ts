import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonCheckbox, IonButton } from '@ionic/angular/standalone';
import { TopbarComponent } from 'src/app/components/topbar/topbar.component';
import { BackButtonComponent } from 'src/app/back-button/back-button.component';
import { UxButtonComponent } from 'src/app/submodules/angular-ux-button/standalone/ux-button.component';
import { ActivatedRoute, Router } from '@angular/router';
import { I18nPipeShortened } from 'src/app/i18n.pipe';

/**
 * Use variable to display two languages and create two different components
 */
@Component({
  selector: 'app-terms-and-conditions',
  templateUrl: './terms-and-conditions.page.html',
  styleUrls: ['./terms-and-conditions.page.scss'],
  standalone: true,
  imports: [IonButton, IonCheckbox, IonLabel, IonItem, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,
    TopbarComponent, BackButtonComponent, UxButtonComponent, ReactiveFormsModule
  ]
})
export class TermsAndConditionsPage implements OnInit {
  form: FormGroup = new FormGroup({
    accepted: new FormControl(false, Validators.requiredTrue)
  })
  displayedError = {
    accepted: false
  }
  formIsLoading:boolean = false;

  mode: 'form'|'view' = 'form' // Form: User can accept the terms and conditions, View: User can only view the terms and conditions

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.mode = this.route.snapshot.queryParamMap.get("mode") as any || 'form';
  }

  skip(){
    // Might be subjected to changes in the future
    this.router.navigate(['/dashboard'])
  }

  submit(){
    // Handle if needed
    this.router.navigate(['/dashboard'])
  }

}


@Component({
  selector: 'app-terms-and-conditions',
  templateUrl: './terms-and-conditions-en.page.html',
  styleUrls: ['./terms-and-conditions.page.scss'],
  standalone: true,
  imports: [IonButton, IonCheckbox, IonLabel, IonItem, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,
    TopbarComponent, BackButtonComponent, UxButtonComponent, ReactiveFormsModule, I18nPipeShortened
  ]
})
export class TermsAndConditionsPageEn extends TermsAndConditionsPage {}

@Component({
  selector: 'app-terms-and-conditions',
  templateUrl: './terms-and-conditions-fr.page.html',
  styleUrls: ['./terms-and-conditions.page.scss'],
  standalone: true,
  imports: [IonButton, IonCheckbox, IonLabel, IonItem, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,
    TopbarComponent, BackButtonComponent, UxButtonComponent, ReactiveFormsModule, I18nPipeShortened
  ]
})
export class TermsAndConditionsPageFr extends TermsAndConditionsPage {}