import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonButton, IonIcon } from "@ionic/angular/standalone";
import { JobEntity } from 'src/app/models/Candidate';
import { ellipsisHorizontalCircleOutline } from 'ionicons/icons';
import { DisplayableJobInvitationEntity } from 'src/app/pages/jobboard/jobboard.page';
import { I18nPipeShortened } from 'src/app/i18n.pipe';

@Component({
  selector: 'app-clickable-job-card',
  templateUrl: './clickable-job-card.component.html',
  styleUrls: ['./clickable-job-card.component.scss'],
  standalone: true,
  imports: [IonButton, IonIcon, RouterModule, I18nPipeShortened]
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
    this.displayableInvitationEntity?.$?.subscribe((entity)=>{ // Unused (but can have some potential)
    })
  }

  // Icons
  ellipsisHorizontalCircleOutline = ellipsisHorizontalCircleOutline
}
