import { Component, Input, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonButton, IonIcon } from '@ionic/angular/standalone';

@Component({
  selector: 'app-clickable-profile-cta',
  templateUrl: './clickable-profile-cta.component.html',
  styleUrls: ['./clickable-profile-cta.component.scss'],
  standalone: true,
  imports: [IonButton, IonIcon, RouterModule]
})
export class ClickableProfileCtaComponent  implements OnInit {
  @Input() variant: string = "default"
  @Input() routerLink: string = "/edit-and-preview-profile" // To be changed
  
  constructor() { }

  ngOnInit() {}

}
