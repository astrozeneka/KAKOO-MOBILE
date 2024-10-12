import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonInput, IonTextarea, IonButton, IonBackButton, IonIcon } from '@ionic/angular/standalone';
import { AbstractPage } from 'src/app/abstract-page';
import { Router } from '@angular/router';
import { BackButtonComponent } from "../../back-button/back-button.component";

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.page.html',
  styleUrls: ['./contact-us.page.scss'],
  standalone: true,
  imports: [IonIcon, IonBackButton, IonButton, IonTextarea, IonInput, IonCard, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, BackButtonComponent]
})
export class ContactUsPage extends AbstractPage implements OnInit {

  constructor(
    private router: Router
  ) {
    super(
      router
    );
  }

  ngOnInit() {
  }

}
