import { Component, Input, OnInit } from '@angular/core';
import { JobEntity } from 'src/app/models/Candidate';
import { IonSpinner } from "@ionic/angular/standalone";

@Component({
  selector: 'app-job-details-header',
  templateUrl: './job-details-header.component.html',
  styleUrls: ['./job-details-header.component.scss'],
  standalone: true,
  imports: [IonSpinner]
})
export class JobDetailsHeaderComponent  implements OnInit {
  @Input() jobEntity: JobEntity|null = null as any;

  constructor() { }

  ngOnInit() {}

}
