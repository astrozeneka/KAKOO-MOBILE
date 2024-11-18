import { ChangeDetectorRef, Component, Input, OnChanges, OnInit } from '@angular/core';
import { JobEntity } from 'src/app/models/Candidate';
import { ProfileUtilsService } from 'src/app/services/profile-utils.service';

@Component({
  selector: 'app-job-details-requirements-table',
  templateUrl: './job-details-requirements-table.component.html',
  styleUrls: ['./job-details-requirements-table.component.scss'],
  standalone: true
})
export class JobDetailsRequirementsTableComponent  implements OnInit, OnChanges {
  @Input() jobEntity: JobEntity|null = null as any

  constructor(
    public pus: ProfileUtilsService,
    public cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {}

  ngOnChanges() {
    this.cdr.detectChanges()
    console.log(this.jobEntity?.totalExperience)
  }
}
