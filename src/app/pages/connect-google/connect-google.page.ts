import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton } from '@ionic/angular/standalone';
import { TopbarComponent } from 'src/app/components/topbar/topbar.component';
import { BackButtonComponent } from 'src/app/back-button/back-button.component';
import { Browser } from '@capacitor/browser';
import { environment } from 'src/environments/environment';
import { I18nPipeShortened } from 'src/app/i18n.pipe';


@Component({
  selector: 'app-connect-google',
  templateUrl: './connect-google.page.html',
  styleUrls: ['./connect-google.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, TopbarComponent, BackButtonComponent, IonButton, I18nPipeShortened]
})
export class ConnectGooglePage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  openBrowser() {
    Browser.open({url: `https://${environment.serverHost}/candidate/signup`})
  }

}
