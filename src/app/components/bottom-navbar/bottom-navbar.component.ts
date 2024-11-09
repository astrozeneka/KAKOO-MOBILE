import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonButton, IonIcon } from '@ionic/angular/standalone';

@Component({
  selector: 'app-bottom-navbar',
  templateUrl: './bottom-navbar.component.html',
  styleUrls: ['./bottom-navbar.component.scss'],
  standalone: true,
  imports: [IonButton, IonIcon]
})
export class BottomNavbarComponent  implements OnInit {
  @Input() tabName: string|null = null

  constructor(
    public router: Router,
  ) { }

  ngOnInit() {}

}
