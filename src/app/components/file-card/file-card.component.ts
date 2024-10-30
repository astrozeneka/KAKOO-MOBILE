import { Component, OnInit } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';

@Component({
  selector: 'app-file-card',
  templateUrl: './file-card.component.html',
  styleUrls: ['./file-card.component.scss'],
  standalone: true,
  imports: [IonIcon]
})
export class FileCardComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
