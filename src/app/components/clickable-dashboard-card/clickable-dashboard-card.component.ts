import { Component, Input, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonButton, IonIcon } from '@ionic/angular/standalone';

@Component({
  selector: 'app-clickable-dashboard-card',
  templateUrl: './clickable-dashboard-card.component.html',
  styleUrls: ['./clickable-dashboard-card.component.scss'],
  standalone: true,
  imports: [IonButton, IonIcon, RouterModule]
})
export class ClickableDashboardCardComponent  implements OnInit {
  @Input() slug: string = '';
  @Input() color: string = '';
  @Input() variant: string = "default"

  // The displayed value
  @Input() title: string = '';
  @Input() subtitle: string = '';

  @Input() routerLink: string|null = null

  constructor() { }

  ngOnInit() {}

}
