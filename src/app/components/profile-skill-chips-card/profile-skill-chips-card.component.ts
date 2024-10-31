import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile-skill-chips-card',
  templateUrl: './profile-skill-chips-card.component.html',
  styleUrls: ['./profile-skill-chips-card.component.scss'],
  standalone: true
})
export class ProfileSkillChipsCardComponent  implements OnInit {
  @Input() items: string[] = []

  constructor() { }

  ngOnInit() {}

}
