import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { JobEntity } from 'src/app/models/Candidate';
import { IonSpinner } from "@ionic/angular/standalone";
import { EJobEntity } from 'src/app/pages/job-detail/job-detail.page';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-job-details-header',
  templateUrl: './job-details-header.component.html',
  styleUrls: ['./job-details-header.component.scss'],
  standalone: true,
  imports: [IonSpinner, JsonPipe]
})
export class JobDetailsHeaderComponent  implements OnInit, OnChanges {
  @Input() jobEntity: EJobEntity|null = null as any;

  constructor() { }

  ngOnInit() {}

  ngOnChanges() {
    console.log(this.jobEntity)
  }

}
