import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-employer-questions',
  templateUrl: './employer-questions.page.html',
  styleUrls: ['./employer-questions.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class EmployerQuestionsPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
