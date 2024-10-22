import { Component, OnInit } from '@angular/core';
import { IonButton } from "@ionic/angular/standalone";

@Component({
  selector: 'app-success-message',
  templateUrl: './success-message.component.html',
  styleUrls: ['./success-message.component.scss'],
  standalone: true,
  imports: [IonButton, ]
})
export class SuccessMessageComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
