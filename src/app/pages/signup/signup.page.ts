import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon, IonInput, IonSelect, IonSelectOption } from '@ionic/angular/standalone';
import { AbstractPage } from 'src/app/abstract-page';
import { Router } from '@angular/router';
import { BackButtonComponent } from "../../back-button/back-button.component";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: [
    './signup.page.scss',
    '../../stylesheets/login-signup.scss'
  ],
  standalone: true,
  imports: [IonSelect, IonSelectOption, IonInput, IonIcon, IonButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, BackButtonComponent]
})
export class SignupPage extends AbstractPage implements OnInit{

  constructor(
    private router:Router
  ) { 
    super(
      router
    );
  }

  ngOnInit() {
  }

}
