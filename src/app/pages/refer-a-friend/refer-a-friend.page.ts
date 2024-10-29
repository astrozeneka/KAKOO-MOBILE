import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonButton, IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonText, IonInput, IonItem, IonIcon } from '@ionic/angular/standalone';
import { ReferalInputComponent } from 'src/app/components/referal-input/referal-input.component';
import { TopbarComponent } from 'src/app/components/topbar/topbar.component';
import { BackButtonComponent } from 'src/app/back-button/back-button.component';

@Component({
  selector: 'app-refer-a-friend',
  templateUrl: './refer-a-friend.page.html',
  styleUrls: ['./refer-a-friend.page.scss'],
  standalone: true,
  imports: [IonIcon, IonItem, IonButton, IonInput, IonText, IonButtons, IonBackButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,
    ReferalInputComponent, TopbarComponent, BackButtonComponent
  ]
})
export class ReferAFriendPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
