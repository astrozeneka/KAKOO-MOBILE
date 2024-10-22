import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonIcon } from '@ionic/angular/standalone';
import { ExperienceCardComponent } from 'src/app/components/experience-card/experience-card.component';

@Component({
  selector: 'app-edit-and-preview-profile',
  templateUrl: './edit-and-preview-profile.page.html',
  styleUrls: ['./edit-and-preview-profile.page.scss'],
  standalone: true,
  imports: [IonIcon, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, ExperienceCardComponent]
})
export class EditAndPreviewProfilePage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
