import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-apply-job-form',
  templateUrl: './apply-job-form.page.html',
  styleUrls: ['./apply-job-form.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class ApplyJobFormPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
