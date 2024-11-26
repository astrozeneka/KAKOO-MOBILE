import { JsonPipe } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { JobCustomQuestionEntity } from 'src/app/models/Candidate';
import { IonSpinner } from "@ionic/angular/standalone";
import { I18nPipeShortened } from 'src/app/i18n.pipe';

@Component({
  selector: 'app-job-details-employer-questions',
  templateUrl: './job-details-employer-questions.component.html',
  styleUrls: ['./job-details-employer-questions.component.scss'],
  standalone: true,
  imports: [JsonPipe, IonSpinner, I18nPipeShortened]
})
export class JobDetailsEmployerQuestionsComponent  implements OnInit, OnChanges {
  @Input() jobCustomQuestionEntities: JobCustomQuestionEntity[] = [];
  // Todo loading (see the edit-and-preview-profile) 5min

  constructor() { }

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges): void {
  }

}
