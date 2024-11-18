import { Component, Input, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonButton, IonIcon } from "@ionic/angular/standalone";

@Component({
  selector: 'app-clickable-job-card',
  templateUrl: './clickable-job-card.component.html',
  styleUrls: ['./clickable-job-card.component.scss'],
  standalone: true,
  imports: [IonButton, IonIcon, RouterModule]
})
export class ClickableJobCardComponent  implements OnInit {
  @Input() status:string = '';
  @Input() variant:string = 'defautl';
  @Input() routerLink:string = '';

  constructor() { }

  ngOnInit() {}

}
