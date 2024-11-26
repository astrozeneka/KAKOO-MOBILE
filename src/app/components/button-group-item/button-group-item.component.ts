import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonButton, IonIcon } from '@ionic/angular/standalone';

@Component({
  selector: 'app-button-group-item',
  templateUrl: './button-group-item.component.html',
  styleUrls: ['./button-group-item.component.scss'],
  standalone: true,
  imports: [IonButton, IonIcon, RouterModule]
})
export class ButtonGroupItemComponent  implements OnInit {
  @Input() color: string = 'dark';
  @Input() chip: number = 0;

  @Input() routerLink: string|undefined;
  @Input() queryParams: any
  @Input() disabled: boolean = false;
  
  constructor() { }

  ngOnInit() {}
}
