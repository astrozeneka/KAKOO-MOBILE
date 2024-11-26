import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { register } from 'swiper/element/bundle';
import { RouterModule } from '@angular/router';
import { I18nPipeShortened } from 'src/app/i18n.pipe';

@Component({
  selector: 'app-splash-2',
  templateUrl: './splash-2.page.html',
  styleUrls: ['./splash-2.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, RouterModule, I18nPipeShortened],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Splash2Page implements OnInit {

  constructor() { 
    register() // Register swiper
  }

  ngOnInit() {
  }

}
