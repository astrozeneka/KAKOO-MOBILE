import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
  standalone: true
})
export class TopbarComponent  implements OnInit {

  // The topbar progress value (0-1)
  @Input() progress: number = 0
  @Input() color: string = 'light';

  // experimental
  @Input() variant: string = 'default'

  constructor() { }

  ngOnInit() {
  }

}
