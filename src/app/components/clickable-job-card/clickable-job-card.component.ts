import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonButton, IonIcon } from "@ionic/angular/standalone";
import { JobEntity } from 'src/app/models/Candidate';
import { ellipsisHorizontalCircleOutline } from 'ionicons/icons';
import { DisplayableJobInvitationEntity } from 'src/app/pages/jobboard/jobboard.page';

@Component({
  selector: 'app-clickable-job-card',
  templateUrl: './clickable-job-card.component.html',
  styleUrls: ['./clickable-job-card.component.scss'],
  standalone: true,
  imports: [IonButton, IonIcon, RouterModule]
})
export class ClickableJobCardComponent  implements OnInit, OnChanges {
  @Input() status:string = ''; // Deprecated, should use the related job-entity instead
  @Input() variant:string = 'defautl';
  @Input() routerLink:string = '';
  @Input() jobEntity:JobEntity|null = null as any;

  // Experimental feature for the StoredArray function
  @Input() displayableInvitationEntity:DisplayableJobInvitationEntity|null = null

  constructor() { }

  ngOnInit() {}

  ngOnChanges() {
    this.routerLink = '/job-detail/' + this.jobEntity?.jobId
    this.displayableInvitationEntity?.$?.subscribe((entity)=>{
      console.log("UPDATE ENTITY", entity)
    })
  }

  // Icons
  ellipsisHorizontalCircleOutline = ellipsisHorizontalCircleOutline
}
