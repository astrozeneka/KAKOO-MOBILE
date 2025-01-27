import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon, IonInput } from '@ionic/angular/standalone';
import { AbstractPage } from 'src/app/abstract-page';
import { Router } from '@angular/router';
import { BackButtonComponent } from 'src/app/back-button/back-button.component';
import { Browser } from '@capacitor/browser';
import { I18nPipeShortened } from 'src/app/i18n.pipe';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: [
    './reset-password.page.scss',
    '../../stylesheets/login-signup.scss'
  ],
  standalone: true,
  imports: [
    IonInput, IonIcon, IonButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,
    BackButtonComponent, I18nPipeShortened
  ]
})
export class ResetPasswordPage extends AbstractPage implements OnInit {

  constructor(
    router: Router
  ) {
    super(router);
  }

  ngOnInit() {
  }

  openBrowser() {
    Browser.open({url: `https://${environment.serverHost}/candidate/login`})
  }

}
