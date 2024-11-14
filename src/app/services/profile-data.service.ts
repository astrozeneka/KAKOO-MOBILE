import { Injectable } from '@angular/core';
import { JobInvitationEntity, PaginedJobInvitationArray } from '../models/Candidate';
import StoredData from '../submodules/stored-data/StoredData';
import { BehaviorSubject, catchError, filter, merge, Observable, throwError } from 'rxjs';
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

  constructor(
    private cs: ContentService,
    private storage: Storage
  ) {
    this.jobInvitationsData = new StoredData<JobInvitationEntity[]>('jobInvitations', this.storage)
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

  }
}
