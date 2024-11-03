import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonIcon, IonButton } from '@ionic/angular/standalone';
import { FileCardComponent } from 'src/app/components/file-card/file-card.component';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: [
    './welcome.page.scss',
    '../../stylesheets/login-signup.scss'
  ],
  standalone: true,
  imports: [IonButton, IonIcon, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, FileCardComponent]
})
export class WelcomePage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
