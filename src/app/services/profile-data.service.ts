import { Injectable, output } from '@angular/core';
import { JobEntity, JobInvitationEntity, PaginedJobInvitationArray, MeetingEntity } from '../models/Candidate';
import StoredData from '../submodules/stored-data/StoredData';
import { BehaviorSubject, catchError, filter, forkJoin, merge, Observable, tap, throwError } from 'rxjs';
import { ContentService } from './content.service';
import { Storage } from '@ionic/storage-angular';

/**
 * This component will be used to manage cache data for data related to the user (e.g. meeting, assessment, job-invitations)
 */
@Injectable({
  providedIn: 'root'
})
export class ProfileDataService {

  jobInvitationsData: StoredData<JobInvitationEntity[]>
  jobInvitationsSubject = new BehaviorSubject<JobInvitationEntity[]|null>([])
  jobInvitations$ = this.jobInvitationsSubject.asObservable()

  meetingsData: StoredData<MeetingEntity[]>
  meetingsSubject = new BehaviorSubject<MeetingEntity[]|null>([])
  meetings$ = this.meetingsSubject.asObservable()

  constructor(
    private cs: ContentService,
    private storage: Storage
  ) {
    this.jobInvitationsData = new StoredData<JobInvitationEntity[]>('jobInvitations', this.storage)
    this.meetingsData = new StoredData<MeetingEntity[]>('meetings', this.storage)
  }

  onJobInvitationsData(fromCache=true, fromServer=true):Observable<JobInvitationEntity[]>{
    let additionalEventsSubject = new BehaviorSubject<JobInvitationEntity[]|null>(null)
    let additionalEvents$ = additionalEventsSubject.asObservable()

    // 1. Fire the cached data
    if (fromCache) {
      this.jobInvitationsData.get().then((data:JobInvitationEntity[]|null)=>{
          additionalEventsSubject.next(data)
      })
    }

    // 2. Fire from the server
    if (fromServer) {
      this.cs.get_exp(`/api/v1/job/invited-job-list-by-user`, {})
        .pipe(catchError((error)=>{
          return throwError(error)  
        }))
        .subscribe((data:PaginedJobInvitationArray)=>{
          additionalEventsSubject.next(data.content)
          // Here, pagined data is not yet supported
          this.jobInvitationsData.set(data.content)
        })
    }

    let output$ = merge(this.jobInvitations$, additionalEvents$)
    output$ = output$.pipe(filter((data)=>data!=null))
    return output$ as Observable<JobInvitationEntity[]>
  }
  requestJobInvitationsDataUpdate(){
    // TODO later if needed
  }

  /**
   * 
   * @param fromCache 
   * @param fromServer 
   * @param allowPartial (Only if fromServer=true) allow firing partial data
   * @returns 
   */
  onMeetingData(fromCache=true, fromServer=true, allowPartial=false):Observable<MeetingEntity[]>{
    let outputSubject = new BehaviorSubject<MeetingEntity[]>([]);
    let output$ = outputSubject.asObservable();

    if (fromCache) {
      this.meetingsData.get().then((data:MeetingEntity[]|null)=>{
        if (data!=null)
          outputSubject.next(data)
      })
    }
    if (fromServer) {
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
                  const index = completed.findIndex(item => item.id > meeting.id);
                  if (index === -1) {
                    completed.push(meeting);
                  } else {
                    completed.splice(index, 0, meeting);
                  }
                })
              )
              allLoaders$.push(loader$)
          })

          merge(...allLoaders$)
            .subscribe(_=>{ // We don't use since we already process the data in the tap operator
              if (allowPartial)
                outputSubject.next(completed)
            })
          
          forkJoin(allLoaders$)
            .subscribe((_:JobEntity[])=>{ // We don't use since we already process the data in the tap operator
              this.meetingsData.set(meetings)
              if (!allowPartial)
                outputSubject.next(meetings) // Return all meetings
            })
        })
      }

      
    return output$ as Observable<MeetingEntity[]>
  }
}
