import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { TopbarComponent } from 'src/app/components/topbar/topbar.component';
import { BackButtonComponent } from 'src/app/back-button/back-button.component';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.page-en.html',
  styleUrls: ['./privacy-policy.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, TopbarComponent, BackButtonComponent]
})
export class PrivacyPolicyPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.page-en.html',
  styleUrls: ['./privacy-policy.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, TopbarComponent, BackButtonComponent]
})
export class PrivacyPolicyPageEn extends PrivacyPolicyPage {}

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.page-fr.html',
  styleUrls: ['./privacy-policy.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, TopbarComponent, BackButtonComponent]
})
export class PrivacyPolicyPageFr extends PrivacyPolicyPage {}

