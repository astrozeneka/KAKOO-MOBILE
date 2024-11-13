import { Component, Input, OnInit } from '@angular/core';
import { Candidate } from '../models/Candidate';

@Component({
  selector: 'app-svg-profile',
  templateUrl: './svg-profile.component.html',
  styleUrls: ['./svg-profile.component.scss'],
  standalone: true
})
export class SvgProfileComponent  implements OnInit {

  @Input() candidate!: Candidate;
  @Input() size: string|number = 102;

  svgText: string = ``;

  constructor() { }

  ngOnInit() {
    if (!this.candidate) {
      throw new Error('Candidate input is required');
    }

    // The initials of the person
    this.svgText = this.candidate.firstName[0] + this.candidate.lastName[0];
  }

}
