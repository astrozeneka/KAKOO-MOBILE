import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-language-selector-1',
  templateUrl: './language-selector-1.page.html',
  styleUrls: ['./language-selector-1.page.scss'],
  standalone: true,
  imports: [IonButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class LanguageSelector1Page implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
