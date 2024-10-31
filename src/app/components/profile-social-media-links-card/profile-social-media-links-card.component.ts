import { Component, OnInit } from '@angular/core';
import { SocialChipComponent } from '../social-chip/social-chip.component';
import { IonButton, IonIcon } from "@ionic/angular/standalone";

@Component({
  selector: 'app-profile-social-media-links-card',
  templateUrl: './profile-social-media-links-card.component.html',
  styleUrls: ['./profile-social-media-links-card.component.scss'],
  standalone: true,
  imports: [IonIcon, IonButton, SocialChipComponent]
})
export class ProfileSocialMediaLinksCardComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
