import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { TopbarComponent } from '../components/topbar/topbar.component';
import { BackButtonComponent } from '../back-button/back-button.component';

@Component({
  selector: 'app-about',
  templateUrl: './about.page-en.html',
  styleUrls: ['./about.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, TopbarComponent, BackButtonComponent]
})
export class AboutPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

@Component({
  selector: 'app-about',
  templateUrl: './about.page-en.html',
  styleUrls: ['./about.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, TopbarComponent, BackButtonComponent]
})
export class AboutPageEn extends AboutPage {}

@Component({
  selector: 'app-about',
  templateUrl: './about.page-fr.html',
  styleUrls: ['./about.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, TopbarComponent, BackButtonComponent]
})
export class AboutPageFr extends AboutPage {}