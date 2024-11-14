import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonTextarea, IonButton, IonIcon } from '@ionic/angular/standalone';
import { FileCardComponent } from 'src/app/components/file-card/file-card.component';
import { TopbarComponent } from 'src/app/components/topbar/topbar.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ContentService } from 'src/app/services/content.service';
import { JobEntity } from 'src/app/models/Candidate';

@Component({
  selector: 'app-employer-questions',
  templateUrl: './employer-questions.page.html',
  styleUrls: ['./employer-questions.page.scss'],
  standalone: true,
  imports: [IonIcon, IonButton, IonTextarea, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, FileCardComponent, TopbarComponent,
    
  ]
})
export class EmployerQuestionsPage implements OnInit {

  jobId:number
  jobEntity:JobEntity|null = null

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private cs: ContentService
  ) { 
    this.jobId = parseInt(this.route.snapshot.paramMap.get('jobId')!);
  }

  ngOnInit() {
    //Load job
    this.cs.get_exp(`/api/v1/job/job-id/${this.jobId}`, {})
      .subscribe((job:JobEntity)=>{
        this.jobEntity = job
        console.log(this.jobEntity)
      })
  }

}
