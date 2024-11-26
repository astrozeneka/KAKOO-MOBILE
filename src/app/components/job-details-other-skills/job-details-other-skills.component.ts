import { Component, Input, OnInit } from '@angular/core';
import { I18nPipeShortened } from 'src/app/i18n.pipe';
import { OtherSkillEntity } from 'src/app/models/Candidate';

@Component({
  selector: 'app-job-details-other-skills',
  templateUrl: './job-details-other-skills.component.html',
  styleUrls: ['./job-details-other-skills.component.scss'],
  standalone: true,
  imports: [I18nPipeShortened]
})
export class JobDetailsOtherSkillsComponent  implements OnInit {
  @Input() otherSkills: OtherSkillEntity[] = []

  constructor() { }

  ngOnInit() {}

}
