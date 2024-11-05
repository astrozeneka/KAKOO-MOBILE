import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-splash-icon',
  templateUrl: './splash-icon.page.html',
  styleUrls: ['./splash-icon.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class SplashIconPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
