import { Component, OnInit } from '@angular/core';
import { IonButton, IonIcon } from "@ionic/angular/standalone";
import { Location } from '@angular/common';

@Component({
  selector: 'app-back-button',
  templateUrl: './back-button.component.html',
  styleUrls: ['./back-button.component.scss'],
  imports: [IonButton, IonIcon],
  standalone: true
})
export class BackButtonComponent  implements OnInit {

  constructor(
    private location: Location
  ) { }

  ngOnInit() {}

  back(){
    this.location.back()
  }

}
