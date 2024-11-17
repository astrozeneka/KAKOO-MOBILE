import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { SocialChipComponent } from '../social-chip/social-chip.component';
import { IonButton, IonIcon, IonSpinner } from "@ionic/angular/standalone";
import { ProfileUtilsService } from 'src/app/services/profile-utils.service';
import { Candidate, SocialAccountEntity } from 'src/app/models/Candidate';

@Component({
  selector: 'app-profile-social-media-links-card',
  templateUrl: './profile-social-media-links-card.component.html',
  styleUrls: ['./profile-social-media-links-card.component.scss'],
  standalone: true,
  imports: [IonIcon, IonButton, SocialChipComponent, IonSpinner]
})
export class ProfileSocialMediaLinksCardComponent  implements OnInit, OnChanges {
  @Input() candidate: Candidate|null = null
  candidateSocialAccounts:{[key:string]:SocialAccountEntity} = {}


  processFacebookEntity(entity?:SocialAccountEntity):string{
    if (entity) {
      if(entity.profileUrl.includes("facebook.com")){
        return entity.profileUrl.slice(entity.profileUrl.indexOf('.com/') + 5).replace('/', '')
      } else {
        return entity.profileUrl
      }
    } else {
      return "-"
    }
  }
  processXEntity(entity?:SocialAccountEntity):string{
    if (entity) {
      if(entity.profileUrl.includes("x.com")){
        return entity.profileUrl.slice(entity.profileUrl.indexOf('.com/') + 5).replace('/', '')
      } else {
        return entity.profileUrl
      }
    } else {
      return "-"
    }
  }
  processLinkedInEntity(entity?:SocialAccountEntity):string{
    if (entity) {
      if(entity.profileUrl.includes("linkedin.com/in/")){
        return entity.profileUrl.slice(entity.profileUrl.indexOf('.com/in/') + 8).replace('/', '')
      } else {
        return entity.profileUrl
      }
    } else {
      return "-"
    }
  }
  processInstagramEntity(entity?:SocialAccountEntity):string{
    if (entity) {
      if(entity.profileUrl.includes("instagram.com")){
        return entity.profileUrl.slice(entity.profileUrl.indexOf('.com/') + 5).replace('/', '')
      } else {
        return entity.profileUrl
      }
    } else {
      return "-"
    }
  }
  processYoutubeEntity(entity?:SocialAccountEntity):string{
    if (entity) {
      if(entity.profileUrl.includes("youtube.com")){
        return entity.profileUrl.slice(entity.profileUrl.indexOf('.com/') + 5).replace('/', '')
      } else {
        return entity.profileUrl
      }
    } else {
      return "-"
    }
  }
  processGithubEntity(entity?:SocialAccountEntity):string{
    if (entity) {
      if(entity.profileUrl.includes("github.com")){
        return entity.profileUrl.slice(entity.profileUrl.indexOf('.com/') + 5).replace('/', '')
      } else {
        return entity.profileUrl
      }
    } else {
      return "-"
    }
  }
  processGlassdoorEntity(entity?:SocialAccountEntity):string{
    if (entity) {
      if(entity.profileUrl.includes("glassdoor.com")){
        return entity.profileUrl.slice(entity.profileUrl.indexOf('.com/') + 5).replace('/', '')
      } else {
        return entity.profileUrl
      }
    } else {
      return "-"
    }
  }

  constructor(
    public pus:ProfileUtilsService
  ) { }

  ngOnInit() {
    this.initialize()
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.initialize()
  }

  initialize(){
    if(this.candidate){
      this.candidateSocialAccounts = {}; // Reset the data
      this.candidate.socialAccountEntities.forEach((entity) => {
        this.candidateSocialAccounts[entity.name] = entity;
      });
    }
  }

}
