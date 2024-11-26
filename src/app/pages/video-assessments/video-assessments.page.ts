import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton } from '@ionic/angular/standalone';
import { TopbarComponent } from 'src/app/components/topbar/topbar.component';
import { BackButtonComponent } from 'src/app/back-button/back-button.component';
import { I18nPipeShortened } from 'src/app/i18n.pipe';
import { Browser } from '@capacitor/browser';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-video-assessments',
  templateUrl: './video-assessments.page.html',
  styleUrls: ['./video-assessments.page.scss'],
  standalone: true,
  imports: [IonButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, TopbarComponent, BackButtonComponent, I18nPipeShortened]
})
export class VideoAssessmentsPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  openBrowser() {
    Browser.open({url: `https://${environment.serverHost}/candidate/login`})
  }

}
