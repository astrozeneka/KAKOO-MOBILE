import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon } from '@ionic/angular/standalone';
import { TopbarComponent } from '../../components/topbar/topbar.component';
import { ButtonGroupItemComponent } from "../../components/button-group-item/button-group-item.component";
import { ProfileCtaComponent } from 'src/app/components/profile-cta/profile-cta.component';
import { FileCardComponent } from "../../components/file-card/file-card.component";
import { SectionHeadingComponent } from 'src/app/components/section-heading/section-heading.component';
import { BottomNavbarComponent } from 'src/app/components/bottom-navbar/bottom-navbar.component';
import { BottomNavbarTarget } from 'src/app/utils/bottom-navbar-target';
import { Router } from '@angular/router';
import { ContentService } from 'src/app/services/content.service';
@Component({
  selector: 'app-more-29',
  templateUrl: './more-29.page.html',
  styleUrls: ['./more-29.page.scss'],
  standalone: true,
  imports: [IonIcon, IonButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,
    TopbarComponent, ButtonGroupItemComponent, ProfileCtaComponent, FileCardComponent, FileCardComponent,
    SectionHeadingComponent, BottomNavbarComponent
  ]
})
export class More29Page extends BottomNavbarTarget implements OnInit { // The class name is subjected to change in the future

  constructor(
    router: Router,
    public cs:ContentService
  ) { 
    super(router)
  }

  ngOnInit() {
  }

  testEvent(slug:string){
    console.log(slug);
  }
}
