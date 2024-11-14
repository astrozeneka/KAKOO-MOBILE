import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonSpinner } from '@ionic/angular/standalone';
import { MeetingCardComponent } from 'src/app/components/meeting-card/meeting-card.component';
import { TopbarDashboardComponent } from 'src/app/topbar-dashboard/topbar-dashboard.component';
import { BottomNavbarComponent } from 'src/app/components/bottom-navbar/bottom-navbar.component';
import { BottomNavbarTarget } from 'src/app/utils/bottom-navbar-target';
import { Router } from '@angular/router';
import { ContentService } from 'src/app/services/content.service';
import { JobEntity, MeetingEntity } from 'src/app/models/Candidate';
import { BehaviorSubject, catchError, filter, forkJoin, map, merge, Observable, switchMap, tap, throwError } from 'rxjs';
import { ProfileDataService } from 'src/app/services/profile-data.service';

@Component({
  selector: 'app-meetings',
  templateUrl: './meetings.page.html',
  styleUrls: ['./meetings.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, MeetingCardComponent,
    TopbarDashboardComponent, BottomNavbarComponent, IonSpinner
  ]
})
export class MeetingsPage extends BottomNavbarTarget implements OnInit {

  meetingEntities:MeetingEntity[] = []
  displayedMeetingEntities:MeetingEntity[] = [] // Since we have a filter option
  dataIsLoading:boolean = false

  constructor(
    router: Router,
    private cs: ContentService,
    private pds: ProfileDataService,
    private cdr: ChangeDetectorRef
  ) { 
    super(router)
  }

  ngOnInit() {
    this.dataIsLoading = true
    this.pds.onMeetingData(true, true, true)
      .pipe(
        filter(d=>d.length > 0),
        map(data => data.filter((value, index, self) =>
          index === self.findIndex(t => t.id === value.id) // Assuming each item has a unique 'id' property
        ))
      )
      .subscribe(data=>{
        console.log(data)
        this.meetingEntities = data
        this.displayedMeetingEntities = this.meetingEntities
        this.dataIsLoading = false
        this.cdr.detectChanges()
      })

    /*this._loadInterviewList(true)
      .subscribe((data:MeetingEntity[])=>{
        console.log(data)
        this.meetingEntities = data
        this.displayedMeetingEntities = this.meetingEntities.slice(0, 10) // If will need further filtering
      })*/
    // Test loading meetings from the endpoint
    // this.cs.get_exp('/api/v1/video-interview-list', {})
      /*.subscribe((data:MeetingEntity[])=>{
        this.meetingEntities = data
        this.displayedMeetingEntities = this.meetingEntities // If will need further filtering

        // Here, we only have the jobId

      })*/
  }

  private _loadInterviewList(allowPartial=false):Observable<MeetingEntity[]> {
    /**
     * TODO, move this to the profile data service for better performance
     */

    let outputSubject = new BehaviorSubject<MeetingEntity[]>([]);
    let output$ = outputSubject.asObservable();

    let completed:MeetingEntity[] = []
    

    this.cs.get_exp('/api/v1/video-interview-list', {})
      .pipe(
        catchError((error) => throwError(error))
      ) // Use ChatGPT to use switchMap instead of subscribe
      .subscribe((meetings:MeetingEntity[])=>{
        let allLoaders$:Observable<JobEntity>[] = []
        meetings.forEach(meeting=>{
          let loader$ = this.cs.get_exp(`/api/v1/job/job-id/${meeting.jobId}`, {})
            .pipe(
              tap((jobdata:JobEntity)=>{
                meeting.jobEntity = jobdata
                completed.push(meeting)
              })
            )
            allLoaders$.push(loader$)
        })

        if (allowPartial) {
          // Emit each response as it arrives
          return merge(...allLoaders$)
            // .pipe, to do later to match the common architecture
            .subscribe(_=>{
              outputSubject.next(completed)
            })
        } else {
          return forkJoin(allLoaders$)
            .subscribe((_:JobEntity[])=>{ // We don't use since we already process the data in the tap operator
              outputSubject.next(meetings) // Return all meetings
            })
        }
      })
      
      
      /*.subscribe((data:MeetingEntity[])=>{
        console.log(data)

        // For testing
        this.cs.get_exp(`/api/v1/job/job-id/${data[0].jobId}`, {})
          .subscribe((jobdata)=>{
            console.log(jobdata)
          })
      })*/
    
    return output$
  }

}
