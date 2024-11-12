import { Injectable } from '@angular/core';
import { MobilityEntity } from '../models/Candidate';
import { ContentService } from './content.service';
import { BehaviorSubject, catchError, filter, merge, Observable, throwError } from 'rxjs';
import StoredData from '../submodules/stored-data/StoredData';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class ProfileUtilsService {

  private mobilityOptionsCache: StoredData<MobilityEntity[]>;
  private mobilityOptionsSubject = new BehaviorSubject<MobilityEntity[]>([])
  private mobilityOptions$ = this.mobilityOptionsSubject.asObservable()

  constructor(
    private cs: ContentService,
    private storage: Storage
  ) { 
    this.mobilityOptionsCache = new StoredData<MobilityEntity[]>('mobilityOptions', storage)
  }

  onMobilityOptions(fromCache=true, fromServer=true): Observable<MobilityEntity[]> {
    let additionalEventsSubject = new BehaviorSubject<MobilityEntity[]|null>([])
    let additionalEvents$ = additionalEventsSubject.asObservable()

    // 1. Fire the cached data
    this.mobilityOptionsCache.get().then((data:MobilityEntity[]|null)=>{
      if (fromCache)
        additionalEventsSubject.next(data)
    })

    // 2. Fire from the server
    if (fromServer)
      this.cs.get_exp_fullurl(`https://web.kakoo-software.com/kakoo-back-end/api/v1/candidate-drop-down/mobility`, {}, false)
        .pipe(catchError((error)=>{
          return throwError(error)  
        }))
        .subscribe((data: MobilityEntity[])=>{
          console.log(data)
          additionalEventsSubject.next(data)
          this.mobilityOptionsCache.set(data)
        })

    let output$ = merge(this.mobilityOptions$, additionalEvents$)
    output$ = output$.pipe(filter((data)=>data!=null))
    return output$ as Observable<MobilityEntity[]>
  }

  private _loadMobilityOptions(){
    return this.cs.get_exp_fullurl(`https://web.kakoo-software.com/kakoo-back-end/api/v1/candidate-drop-down/mobility`, {})
      .pipe(catchError((error)=>{
        return throwError(error)
      }))
  }
}
