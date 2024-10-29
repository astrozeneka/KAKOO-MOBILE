import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonSearchbar } from '@ionic/angular/standalone';
import { TopbarComponent } from 'src/app/components/topbar/topbar.component';
import { JobCardComponent } from 'src/app/components/job-card/job-card.component';
import { TopbarDashboardComponent } from 'src/app/topbar-dashboard/topbar-dashboard.component';
import { BottomNavbarComponent } from 'src/app/components/bottom-navbar/bottom-navbar.component';
import { FilterChipsComponent } from 'src/app/components/filter-chips/filter-chips.component';
@Component({
  selector: 'app-jobboard',
  templateUrl: './jobboard.page.html',
  styleUrls: ['./jobboard.page.scss'],
  standalone: true,
  imports: [IonSearchbar, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, TopbarComponent, JobCardComponent, TopbarDashboardComponent,
    BottomNavbarComponent, FilterChipsComponent, ReactiveFormsModule
  ]
})
export class JobboardPage implements OnInit {
  chipControl = new FormControl<string|null>(null)

  constructor() { }

  ngOnInit() {
    setTimeout(()=>{
      this.chipControl.patchValue("all")
    }, 1000)
  }

}
