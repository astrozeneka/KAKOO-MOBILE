import { Injectable, OnInit, output } from '@angular/core';
import { JobEntity, JobInvitationEntity, PaginedJobInvitationArray, MeetingEntity, CandidateEducationEntity, CandidateAssessmentEntity, PaginedEntities, DashboardMetrics, Candidate } from '../models/Candidate';
import StoredData from '../submodules/stored-data/StoredData';
import { BehaviorSubject, catchError, filter, forkJoin, merge, Observable, tap, throwError } from 'rxjs';
import { ContentService } from './content.service';
import { Storage } from '@ionic/storage-angular';
import { DeletableEntity } from '../utils/delete-prompt';
import { environment } from 'src/environments/environment';
import { ReferralEntity, User } from '../models/User';
import { key } from 'ionicons/icons';
import { ProfileUtilsService } from './profile-utils.service';


/**
 * This component will be used to manage cache data for data related to the user (e.g. meeting, assessment, job-invitations)
 */
@Injectable({
  providedIn: 'root'
})
export class ProfileDataService {

  jobInvitationsData: StoredData<JobInvitationEntity[]> // Should experiment the StoredArray instead of StoredData
  jobInvitationsSubject = new BehaviorSubject<JobInvitationEntity[]|null>([])
  jobInvitations$ = this.jobInvitationsSubject.asObservable()

  assessmentData: StoredData<CandidateAssessmentEntity[]> // Should experiment the StoredArray instead of StoredData
  assessmentSubject = new BehaviorSubject<CandidateAssessmentEntity[]|null>([])
  assessment$ = this.assessmentSubject.asObservable()

  meetingsData: StoredData<MeetingEntity[]>
  meetingsSubject = new BehaviorSubject<MeetingEntity[]|null>([])
  meetings$ = this.meetingsSubject.asObservable()

  meetingsV2Data: StoredData<MeetingEntity[]>
  meetingsV2Subject = new BehaviorSubject<MeetingEntity[]|null>([])
  meetingsV2$ = this.meetingsV2Subject.asObservable()

  referralsData: StoredData<ReferralEntity[]>
  referralsSubject = new BehaviorSubject<ReferralEntity[]|null>([])
  referrals$ = this.referralsSubject.asObservable()

  metricsData: StoredData<DashboardMetrics>
  metricsSubject = new BehaviorSubject<DashboardMetrics|null>(null)
  metrics$ = this.metricsSubject.asObservable()

  completenessPercentageData: StoredData<number>
  completenessPercentageSubject = new BehaviorSubject<number|null>(null)
  completenessPercentage$ = this.completenessPercentageSubject.asObservable()
  // Candidate Education (no data stored since data update is fired from other fucntions (e.g. ...))

  constructor(
    private cs: ContentService,
    private storage: Storage,
    private pus: ProfileUtilsService
  ) {
    this.jobInvitationsData = new StoredData<JobInvitationEntity[]>('jobInvitations', this.storage)
    this.assessmentData = new StoredData<CandidateAssessmentEntity[]>('assessments', this.storage)
    this.meetingsData = new StoredData<MeetingEntity[]>('meetings', this.storage)
    this.meetingsV2Data = new StoredData<MeetingEntity[]>('meetingsV2', this.storage)
    this.referralsData = new StoredData<ReferralEntity[]>('referrals', this.storage)
    this.metricsData = new StoredData<DashboardMetrics>('metrics', this.storage)
    this.completenessPercentageData = new StoredData<number>('completenessPercentage', this.storage)
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

  onAssessmentData(fromCache=true, fromServer=true):Observable<CandidateAssessmentEntity[]>{
    let additionalEventsSubject = new BehaviorSubject<CandidateAssessmentEntity[]|null>(null)
    let additionalEvents$ = additionalEventsSubject.asObservable()

    // 1. Fire data from cache
    if (fromCache) {
      this.assessmentData.get().then((data:CandidateAssessmentEntity[]|null)=>{
          additionalEventsSubject.next(data)
      })
    }

    // 2. Fire from the server
    if (fromServer) {
      this.cs.userData.get().then((user:User|null)=>{
        if (!user) console.error('User is not logged in') // Should disconnect in that case
        this.cs.get_exp_fullurl(`${environment.apiEndpoint}/api/v1/candidate-assessment/get-candidate-assessment-by-user-id/${user!.id}?pageNumber=0&pageSize=10&sortBy=createdAt`, {})
          .pipe(catchError((error)=>{
            return throwError(error)
          }))
          .subscribe(async (data:PaginedEntities<CandidateAssessmentEntity>)=>{
            let existingData = await this.assessmentData.get() // An array
            // Merge and sort
            if (existingData){
              data.content.forEach((item)=>{
                let index = existingData!.findIndex((existingItem)=>existingItem.assessmentId==item.assessmentId)
                if (index==-1)
                  existingData!.push(item) // Append
                else 
                  existingData![index] = item // Replace
              })
            }else{
              existingData = data.content
            }
            existingData.sort((a, b)=>a.assessmentId - b.assessmentId)
            additionalEventsSubject.next(existingData)
            this.assessmentData.set(existingData)
          })
      })
    }
    let output$ = merge(this.jobInvitations$, additionalEvents$)
    output$ = output$.pipe(filter((data)=>data!=null))
    return output$ as Observable<CandidateAssessmentEntity[]>
  }

  /**
   * @deprecated Use onMeetingDataV2 instead
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

  onMeetingDataV2(fromCache=true, fromServer=true):Observable<MeetingEntity[]>{
    let additionalEventsSubject = new BehaviorSubject<MeetingEntity[]>([])
    let additionalEvents$ = additionalEventsSubject.asObservable()

    if (fromCache) {
      this.meetingsV2Data.get().then((data:MeetingEntity[]|null)=>{
        if (data!=null)
          additionalEventsSubject.next(data)
      })
    }
    if (fromServer) {
      // Unoptimized way for loading data
      this.cs.get_exp_fullurl(`${environment.apiEndpoint}/api/v1/financial-negotiation/get-by-candidate?pageSize=1024`, {})
        .pipe(catchError((error)=>throwError(error)))
        .subscribe((data:PaginedEntities<MeetingEntity>)=>{
          additionalEventsSubject.next(data.content)
          this.meetingsV2Data.set(data.content)
        })
    }

    let output$ = merge(this.meetingsV2$, additionalEvents$)
    output$ = output$.pipe(filter((data)=>data!=null))
    return output$ as Observable<MeetingEntity[]>
  }

  onReferralsData(fromCache=true, fromServer=true):Observable<ReferralEntity[]>{
    let additionalEventsSubject = new BehaviorSubject<ReferralEntity[]|null>(null)
    let additionalEvents$ = additionalEventsSubject.asObservable()

    // 1. Fire the cached data
    if (fromCache) {
      this.referralsData!.get().then((data:ReferralEntity[]|null)=>{
          additionalEventsSubject.next(data)
      })
    }

    // 2. Fire from the server
    if (fromServer) {
      this.cs.userData.get().then((user:User|null)=>{
        if (!user) console.error('User is not logged in') // Should disconnect in that case
        this.cs.get_exp(`/api/v1/referral-sys/all/referred-list/${user!.myReferralCode}`, {})
          .pipe(catchError((error)=>{
            return throwError(error)
          }))
          .subscribe((referrals: {data: ReferralEntity[]})=>{
            additionalEventsSubject.next(referrals.data)
            this.referralsData!.set(referrals.data)
          })
      })
    }

    let output$ = merge(this.referrals$, additionalEvents$)
    output$ = output$.pipe(filter((data)=>data!=null))
    return output$ as Observable<ReferralEntity[]>
  }

  onMetricsData(fromCache=true, fromServer=true):Observable<DashboardMetrics>{
    let additionalEventsSubject = new BehaviorSubject<DashboardMetrics|null>(null)
    let additionalEvents$ = additionalEventsSubject.asObservable()

    // 1. Fire the cached data
    if (fromCache) {
      this.metricsData!.get().then((data:DashboardMetrics|null)=>{
          additionalEventsSubject.next(data)
      })
    }

    // 2. Fire from the server
    if (fromServer) {
      this.cs.get_exp_fullurl(`${environment.apiEndpoint}/api/v1/dashboard/candidate/get-all-count`, {})
        .pipe(catchError((error)=>{
          return throwError(error)
        }))
        .subscribe((data:DashboardMetrics)=>{
          additionalEventsSubject.next(data)
          this.metricsData!.set(data)
        })
    }

    let output$ = merge(this.metrics$, additionalEvents$)
    output$ = output$.pipe(filter((data)=>data!=null))
    return output$ as Observable<DashboardMetrics>
  }

  onProfileCompletenessPercentageData(fromCache=true, fromBL=true, loadCandidateFromCache=true):Observable<number>{
    let additionalEventsSubject = new BehaviorSubject<number|null>(null)
    let additionalEvents$ = additionalEventsSubject.asObservable()

    // 1. Fire the cached data
    if (fromCache) {
      this.completenessPercentageData!.get().then((data:number|null)=>{
          additionalEventsSubject.next(data)
      })
    }

    // 2. Fire from event business logic
    if (fromBL) {
      this.cs.registerCandidateDataObserverV3(loadCandidateFromCache, true)
        .subscribe((candidate:Candidate|null)=>{
          let overallPercentage = candidate ? this.pus.calculateProfileCompleteness(candidate) : 0
          additionalEventsSubject.next(overallPercentage)
          this.completenessPercentageData!.set(overallPercentage)
        })
    }

    let output$ = merge(this.completenessPercentage$, additionalEvents$)
    output$ = output$.pipe(filter((data)=>data!=null))
    return output$ as Observable<number>
  }

  public clear(){
    // Clear all user related data
    this.jobInvitationsData.set(null as any)
    this.assessmentData.set(null as any)
    this.meetingsData.set(null as any)
    this.referralsData.set(null as any)
    this.metricsData.set(null as any)
    this.completenessPercentageData.set(null as any)
    this.cs.userData.set(null as any)
    this.cs.candidateData.set(null as any)
  }
}
