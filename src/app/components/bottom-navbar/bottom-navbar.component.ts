import { Component, OnInit } from '@angular/core';
import { IonButton, IonIcon } from '@ionic/angular/standalone';

@Component({
  selector: 'app-bottom-navbar',
  templateUrl: './bottom-navbar.component.html',
  styleUrls: ['./bottom-navbar.component.scss'],
  standalone: true,
  imports: [IonButton, IonIcon]
})
export class BottomNavbarComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
