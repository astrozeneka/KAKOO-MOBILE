import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-debug-button',
  templateUrl: './prod-debug-button.component.html',
  styleUrls: ['./prod-debug-button.component.scss'],
  standalone: true
})
export class ProdDebugButtonComponent  implements OnInit {
  @Input() tools: any[] = []

  constructor() { }

  ngOnInit() {}

}
