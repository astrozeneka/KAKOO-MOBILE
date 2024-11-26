import { Component, Input, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonButton } from "@ionic/angular/standalone";
import { SuccessFeedback } from 'src/app/services/feedback.service';

@Component({
  selector: 'app-success-message',
  templateUrl: './success-message.component.html',
  styleUrls: ['./success-message.component.scss'],
  standalone: true,
  imports: [IonButton, RouterModule]
})
export class SuccessMessageComponent  implements OnInit {
  @Input() feedback: SuccessFeedback|null = null as any

  constructor() { }

  ngOnInit() {}

}
