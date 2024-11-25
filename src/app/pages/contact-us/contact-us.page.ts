import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonInput, IonTextarea, IonButton, IonBackButton, IonIcon } from '@ionic/angular/standalone';
import { AbstractPage } from 'src/app/abstract-page';
import { Router, RouterModule } from '@angular/router';
import { BackButtonComponent } from "../../back-button/back-button.component";
import { ThemeService } from 'src/app/services/theme.service';
import { TopbarComponent } from 'src/app/components/topbar/topbar.component';
import { I18nPipeShortened } from 'src/app/i18n.pipe';
import { OutlineInputComponent } from 'src/app/components/outline-input/outline-input.component';
import { OutlineTextareaComponent } from 'src/app/components/outline-textarea/outline-textarea.component';
import { UxButtonComponent } from 'src/app/submodules/angular-ux-button/standalone/ux-button.component';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.page.html',
  styleUrls: ['./contact-us.page.scss'],
  standalone: true,
  imports: [IonIcon, IonBackButton, IonButton, IonTextarea, IonInput, IonCard, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, BackButtonComponent,
    TopbarComponent, I18nPipeShortened, OutlineInputComponent, OutlineTextareaComponent, UxButtonComponent, RouterModule, ReactiveFormsModule
  ]
})
export class ContactUsPage extends AbstractPage implements OnInit {
  form:FormGroup = new FormGroup({
    name: new FormControl(''),
    email: new FormControl(''),
    phone: new FormControl(''),
    message: new FormControl('')
  })
  displayedError: { [key: string]: string } = {
    name: '',
    email: '',
    phone: '',
    message: ''
  }

  constructor(
    private router: Router,
    public themeService: ThemeService
  ) {
    super(
      router
    );
  }

  ngOnInit() {
  }

}
