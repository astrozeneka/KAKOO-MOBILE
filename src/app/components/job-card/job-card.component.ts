import { Component, Input, OnInit } from '@angular/core';
import { IonButton, IonIcon } from "@ionic/angular/standalone";
import { BottomNavbarComponent } from "../bottom-navbar/bottom-navbar.component";

@Component({
  selector: 'app-job-card',
  templateUrl: './job-card.component.html',
  styleUrls: ['./job-card.component.scss'],
  standalone: true,
  imports: [IonButton, IonIcon, BottomNavbarComponent]
})
export class JobCardComponent  implements OnInit {
  @Input() status:string = '';

  constructor() { }

  ngOnInit() {}

}
