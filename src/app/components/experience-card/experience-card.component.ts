import { Component, Input, OnInit } from '@angular/core';
import { IonIcon, IonButton } from "@ionic/angular/standalone";

@Component({
  selector: 'app-experience-card',
  templateUrl: './experience-card.component.html',
  styleUrls: ['./experience-card.component.scss'],
  standalone: true,
  imports: [IonButton, IonIcon]
})
export class ExperienceCardComponent  implements OnInit {

  @Input() editButton:boolean = true;
  @Input() deleteButton:boolean = true;

  constructor() { }

  ngOnInit() {}

}
