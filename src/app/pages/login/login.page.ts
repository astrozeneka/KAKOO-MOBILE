import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonBackButton, IonTitle, IonToolbar, IonItem, IonLabel, IonInput, IonButton, IonIcon } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { AbstractPage } from 'src/app/abstract-page';
import { UXForm } from 'src/app/utils/ux-form';
import { ContentService } from 'src/app/services/content.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: [
    './login.page.scss',
    '../../stylesheets/login-signup.scss'
  ],
  standalone: true,
  imports: [IonIcon, IonButton, IonBackButton, IonInput, IonLabel, IonItem, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, ReactiveFormsModule]
})
export class LoginPage extends AbstractPage implements OnInit {

  form: UXForm = new UXForm({
    "email": new FormControl('', [Validators.required, Validators.email]),
    "password": new FormControl('', [Validators.required])
  });

  constructor(
    private router:Router,
    private cs: ContentService
  ) {
    super(
      router
    );
  }

  ngOnInit() {

    // 1.0 - Handle passwordless login
    

  }

  async requestLogin() {
    // mark form as touched
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }
    this.cs.post('/request-login', {...this.form.value}).subscribe((res) => {
      console.log(res)
      // 2.1 Here, should store the value inside the local storage using storageObservable

      // 2.2 Depending on the backend, here it is possible that we need to load user data separately

      // 2.3 After that, redirect the user to another page
    });
  }

  async loginUsingProvider(provider: string) {
    // 3.0 - Handle login using provider
  }

}
