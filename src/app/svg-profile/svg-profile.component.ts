import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Candidate } from '../models/Candidate';

@Component({
  selector: 'app-svg-profile',
  templateUrl: './svg-profile.component.html',
  styleUrls: ['./svg-profile.component.scss'],
  standalone: true
})
export class SvgProfileComponent  implements OnInit, OnChanges {

  @Input() candidate: Candidate|null = null;
  @Input() initials: string|null = null;
  @Input() size: string|number = 102;

  svgText: string = ``;

  constructor() { }

  ngOnInit() {
    this.initialize();
  }

  ngOnChanges() {
    this.initialize();
  }

  initialize(){
    if (this.initials) {
      this.svgText = this.initials;
    } else if (this.candidate?.firstName && this.candidate?.lastName) {
      this.svgText = this.candidate?.firstName[0] + this.candidate?.lastName[0];
    } else {
      throw new Error('Initials input is required');
    }
  }

}
