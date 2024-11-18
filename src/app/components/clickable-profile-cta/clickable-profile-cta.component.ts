import { Component, Input, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonButton, IonIcon } from '@ionic/angular/standalone';
import { I18nPipeShortened } from 'src/app/i18n.pipe';

@Component({
  selector: 'app-clickable-profile-cta',
  templateUrl: './clickable-profile-cta.component.html',
  styleUrls: ['./clickable-profile-cta.component.scss'],
  standalone: true,
  imports: [IonButton, IonIcon, RouterModule, I18nPipeShortened]
})
export class ClickableProfileCtaComponent  implements OnInit {
  @Input() variant: string = "default"
  @Input() routerLink: string|null = null // To be changed
  
  constructor() { }

  ngOnInit() {}

}
