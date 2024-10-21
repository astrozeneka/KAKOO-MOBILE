import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-meeting-overview',
  templateUrl: './meeting-overview.page.html',
  styleUrls: ['./meeting-overview.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class MeetingOverviewPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
