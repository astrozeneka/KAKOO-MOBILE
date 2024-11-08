import { Component, Input, OnInit } from '@angular/core';
import { IonIcon, IonButton, IonRippleEffect } from '@ionic/angular/standalone';

@Component({
  selector: 'app-file-card',
  templateUrl: './file-card.component.html',
  styleUrls: ['./file-card.component.scss'],
  standalone: true,
  imports: [IonRippleEffect, IonButton, IonIcon]
})
export class FileCardComponent  implements OnInit {
  @Input() variant: string = "default"
  @Input() clickable: boolean = false // Unused (use clickable-file-card instead)

  constructor() { }

  ngOnInit() {}

}
