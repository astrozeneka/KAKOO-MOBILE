import { Component, Input, OnInit } from '@angular/core';
import { Candidate } from 'src/app/models/Candidate';
import { IonSpinner } from "@ionic/angular/standalone";
import { ProfileUtilsService } from 'src/app/services/profile-utils.service';

@Component({
  selector: 'app-profile-job-preferences-card',
  templateUrl: './profile-job-preferences-card.component.html',
  styleUrls: ['./profile-job-preferences-card.component.scss'],
  standalone: true,
  imports: [IonSpinner]
})
export class ProfileJobPreferencesCardComponent  implements OnInit {
  @Input() candidate: Candidate|null = null

  constructor(
    public pus:ProfileUtilsService
  ) { }

  ngOnInit() {}

}
