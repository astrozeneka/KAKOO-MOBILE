import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon } from '@ionic/angular/standalone';
import { AbstractPage } from 'src/app/abstract-page';
import { Router } from '@angular/router';

@Component({
  selector: 'app-check-your-email',
  templateUrl: './check-your-email.page.html',
  styleUrls: [
    './check-your-email.page.scss',
    '../../stylesheets/login-signup.scss'
  ],
  standalone: true,
  imports: [IonIcon, IonButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class CheckYourEmailPage extends AbstractPage implements OnInit {

  constructor(
    router: Router
  ) { 
    super(router);
  }

  ngOnInit() {
  }

}
