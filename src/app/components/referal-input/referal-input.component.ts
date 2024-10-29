import { Component, Input, OnInit } from '@angular/core';
import { IonInput, IonIcon, IonButton } from "@ionic/angular/standalone";

@Component({
  selector: 'app-referal-input',
  templateUrl: './referal-input.component.html',
  styleUrls: ['./referal-input.component.scss'],
  standalone: true,
  imports: [IonInput, IonIcon, IonButton]
})
export class ReferalInputComponent  implements OnInit {

  @Input() value:string|null = null

  constructor() { }

  ngOnInit() {}

}
