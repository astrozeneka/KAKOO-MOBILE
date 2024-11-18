import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonButton, IonIcon } from '@ionic/angular/standalone';
import { I18nPipeShortened } from 'src/app/i18n.pipe';

@Component({
  selector: 'app-bottom-navbar',
  templateUrl: './bottom-navbar.component.html',
  styleUrls: ['./bottom-navbar.component.scss'],
  standalone: true,
  imports: [IonButton, IonIcon, I18nPipeShortened]
})
export class BottomNavbarComponent  implements OnInit {
  @Input() tabName: string|null = null

  constructor(
    public router: Router,
  ) { }

  ngOnInit() {}

}
