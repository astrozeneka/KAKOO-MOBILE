import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-video-assessments',
  templateUrl: './video-assessments.page.html',
  styleUrls: ['./video-assessments.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class VideoAssessmentsPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
