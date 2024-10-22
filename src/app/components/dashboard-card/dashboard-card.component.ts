import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard-card',
  templateUrl: './dashboard-card.component.html',
  styleUrls: ['./dashboard-card.component.scss'],
  standalone: true
})
export class DashboardCardComponent  implements OnInit {
  @Input() slug: string = '';
  @Input() color: string = '';

  // The displayed value
  @Input() title: string = '';
  @Input() subtitle: string = '';

  constructor() { }

  ngOnInit() {}

}
