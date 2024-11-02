import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IonButton, IonIcon } from '@ionic/angular/standalone';

@Component({
  selector: 'app-button-group-item',
  templateUrl: './button-group-item.component.html',
  styleUrls: ['./button-group-item.component.scss'],
  standalone: true,
  imports: [IonButton, IonIcon]
})
export class ButtonGroupItemComponent  implements OnInit {
  @Input() color: string = 'dark';
  @Input() chip: number = 0;
  
  constructor() { }

  ngOnInit() {}
}
