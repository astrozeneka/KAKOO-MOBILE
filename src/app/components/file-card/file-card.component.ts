import { Component, Input, OnInit } from '@angular/core';
import { IonIcon, IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-file-card',
  templateUrl: './file-card.component.html',
  styleUrls: ['./file-card.component.scss'],
  standalone: true,
  imports: [IonButton, IonIcon]
})
export class FileCardComponent  implements OnInit {
  @Input() variant: string = "default"

  constructor() { }

  ngOnInit() {}

}
