import { Component, Input, OnInit } from '@angular/core';
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

  @Input() variant: string = 'default'
  @Input() color: string = 'dark'

  constructor(
    private location: Location
  ) { }

  ngOnInit() {
    console.log(this.color)
    console.log(this.color == 'light')
  }

  back(){
    this.location.back()
  }

}
