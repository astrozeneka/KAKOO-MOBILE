import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { TopbarComponent } from 'src/app/components/topbar/topbar.component';
import { BackButtonComponent } from 'src/app/back-button/back-button.component';

@Component({
  selector: 'app-tips',
  templateUrl: './tips.page-en.html',
  styleUrls: ['./tips.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, TopbarComponent, BackButtonComponent]
})
export class TipsPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

@Component({
  selector: 'app-tips',
  templateUrl: './tips.page-en.html',
  styleUrls: ['./tips.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, TopbarComponent, BackButtonComponent]
})
export class TipsPageEn extends TipsPage {}

@Component({
  selector: 'app-tips',
  templateUrl: './tips.page-fr.html',
  styleUrls: ['./tips.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, TopbarComponent, BackButtonComponent]
})
export class TipsPageFr extends TipsPage {}