import { Component, Input, OnInit } from '@angular/core';
import { IonIcon } from "@ionic/angular/standalone";

@Component({
  selector: 'app-social-chip',
  templateUrl: './social-chip.component.html',
  styleUrls: ['./social-chip.component.scss'],
  standalone: true,
  imports: [IonIcon, ]
})
export class SocialChipComponent  implements OnInit {

  iconsDict:any = {
    'youtube': '/assets/svg/social-icons/icon-youtube.svg',
    'facebook': '/assets/svg/social-icons/icon-facebook.svg',
    'instagram': '/assets/svg/social-icons/icon-instagram.svg',
    'linkedin': '/assets/svg/social-icons/icon-linkedin.svg',
    'x': '/assets/svg/social-icons/icon-x.svg',
    'glassdoor': '/assets/svg/social-icons/icon-glassdoor-16x16.svg',
    'github': '/assets/svg/social-icons/icon-github-16x16.svg'
  }
  @Input() media:string|null = null // youtube, facebook, instagram, linkedin, x (in lower case)
  iconSrc = null

  constructor() { }

  ngOnInit() {
    // Define the icon source
    if (this.media && this.iconsDict[this.media]) {
      this.iconSrc = this.iconsDict[this.media]
    }
  }

}
