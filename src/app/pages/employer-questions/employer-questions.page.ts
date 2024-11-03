import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonTextarea, IonButton, IonIcon } from '@ionic/angular/standalone';
import { FileCardComponent } from 'src/app/components/file-card/file-card.component';
import { TopbarComponent } from 'src/app/components/topbar/topbar.component';

@Component({
  selector: 'app-employer-questions',
  templateUrl: './employer-questions.page.html',
  styleUrls: ['./employer-questions.page.scss'],
  standalone: true,
  imports: [IonIcon, IonButton, IonTextarea, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, FileCardComponent, TopbarComponent,
    
  ]
})
export class EmployerQuestionsPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
