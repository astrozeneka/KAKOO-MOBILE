import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon } from '@ionic/angular/standalone';
import { AbstractPage } from 'src/app/abstract-page';
import { Router } from '@angular/router';
import { I18nPipeShortened } from 'src/app/i18n.pipe';
import Intent from 'src/app/capacitor-plugins/intent.plugin';

@Component({
  selector: 'app-check-your-email',
  templateUrl: './check-your-email.page.html',
  styleUrls: [
    './check-your-email.page.scss',
    '../../stylesheets/login-signup.scss'
  ],
  standalone: true,
  imports: [IonIcon, IonButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, I18nPipeShortened]
})
export class CheckYourEmailPage extends AbstractPage implements OnInit {

  constructor(
    router: Router
  ) { 
    super(router);
  }

  ngOnInit() {
  }

  async openMailApp(){
    console.log("Opening mail app")
    let res = await Intent.openMailApp({})
    console.log(res)
  }

}
