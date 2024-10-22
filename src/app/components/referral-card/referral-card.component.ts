import { Component, Input, OnInit } from '@angular/core';
import { IonIcon } from "@ionic/angular/standalone";

@Component({
  selector: 'app-referral-card',
  templateUrl: './referral-card.component.html',
  styleUrls: ['./referral-card.component.scss'],
  standalone: true,
  imports: [IonIcon]
})
export class ReferralCardComponent  implements OnInit {

  // For later, implementation and typescript can be used for managing those structures
  @Input() status: string|undefined;
  @Input() date: string|undefined;
  @Input() title: string|undefined;
  @Input() subtitle: string|undefined;
  @Input() image: string|undefined;

  constructor() { }

  ngOnInit() {}

}
