import { Component, OnInit } from '@angular/core';
import { IonButton, IonIcon } from "@ionic/angular/standalone";

@Component({
  selector: 'app-meeting-card',
  templateUrl: './meeting-card.component.html',
  styleUrls: ['./meeting-card.component.scss'],
  standalone: true,
  imports: [IonIcon, IonButton, ]
})
export class MeetingCardComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
