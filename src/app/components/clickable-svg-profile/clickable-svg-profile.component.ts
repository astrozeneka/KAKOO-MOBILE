import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonButton } from "@ionic/angular/standalone";
import { Candidate } from 'src/app/models/Candidate';
import { SvgProfileComponent } from 'src/app/svg-profile/svg-profile.component';

@Component({
  selector: 'app-clickable-svg-profile',
  templateUrl: './clickable-svg-profile.component.html',
  styleUrls: ['./clickable-svg-profile.component.scss'],
  standalone: true,
  imports: [IonButton, RouterModule, SvgProfileComponent]
})
export class ClickableSvgProfileComponent  implements OnInit, OnChanges {
  @Input() candidate: Candidate|null = null;
  @Input() initials: string|null = null;
  @Input() routerLink: string|null = null;
  @Input() variant: string = 'default';
  @Input() size: string|number = 41

  constructor() { }

  ngOnInit() {
    this.initialize();
  }

  ngOnChanges() {
    this.initialize();
  }

  initialize(){
    if (this.candidate?.firstName && this.candidate?.lastName) {
      this.initials = this.candidate?.firstName[0] + this.candidate?.lastName[0];
    }
  }

}
