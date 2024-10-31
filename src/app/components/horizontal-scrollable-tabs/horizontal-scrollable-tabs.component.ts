import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IonButton } from "@ionic/angular/standalone";

@Component({
  selector: 'app-horizontal-scrollable-tabs',
  templateUrl: './horizontal-scrollable-tabs.component.html',
  styleUrls: ['./horizontal-scrollable-tabs.component.scss'],
  standalone: true,
  imports: [IonButton]
})
export class HorizontalScrollableTabsComponent  implements OnInit {

  @Input() items: {[key: string]: string} = {}
  activeIndex:number|null = null
  itemKeys:string[] = [] // A after init computed value

  // 2. The event allowing to navigate
  @Output() action = new EventEmitter<string>()

  constructor() { }

  ngOnInit() {
    this.activeIndex = 0
    this.itemKeys = Object.keys(this.items)
  }

  triggerNavigation(slug:string){
    console.log("Emitting " + slug)
    this.action.emit(slug)
  }
}
