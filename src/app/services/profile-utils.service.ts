import { Injectable } from '@angular/core';
import { LanguageEntity, MobilityEntity, SkillEntity, SkillTypeEntity } from '../models/Candidate';
import { ContentService } from './content.service';
import { BehaviorSubject, catchError, filter, forkJoin, merge, Observable, switchMap, tap, throwError } from 'rxjs';
import StoredData from '../submodules/stored-data/StoredData';
import { Storage } from '@ionic/storage-angular';
import { EmploymentType } from '../models/EmploymentType';
import { WorkType } from '../models/WorkType';
import { SalaryExpectation } from '../models/SalaryExpectation';
import { HiringStatus } from '../models/HiringStatus';
import NoticePeriod from '../models/NoticePeriod';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class ProfileUtilsService {

  // CACHED DATA
  private mobilityOptionsCache: StoredData<MobilityEntity[]>;
  private mobilityOptionsSubject = new BehaviorSubject<MobilityEntity[]>([])
  private mobilityOptions$ = this.mobilityOptionsSubject.asObservable()

  // CAUTION, the code below is duplicated
  // UTILITY FUNCTIONS (moved here for better maintainability)
  lang: "en"|"fr" = "en" // BUG, here the language won't change automatically
  // Still need to call get_current() from inside each accessor to get the currenly used language
  employmentTypeOptions: EmploymentType[] = []
  employmentTypeKeyAccessor: (e:EmploymentType) => string = (option: EmploymentType) => 
    (this.lang=="en" ? option?.name : option?.name_fr)
  workTypeOptions: WorkType[] = []
  workTypeKeyAccessor: (e:WorkType) => string = (option: WorkType) => 
    (this.lang=="en" ? option?.name : option?.name_fr)
  salaryExpectationOptions: SalaryExpectation[] = []
  salaryExpectationKeyAccessor: (e:SalaryExpectation) => string = (option: SalaryExpectation) => 
    (this.lang=="en" ? `From ${option.from_amount} ${option.currency} to ${option.to_amount} ${option.currency}` 
      : `De ${option.from_amount} ${option.currency} à ${option.to_amount} ${option.currency}`)
  hiringStatusOptions: HiringStatus[] = []
  hiringStatusKeyAccessor: (e:HiringStatus) => string = (option: HiringStatus) => 
    (this.lang=="en" ? option.name : option.name_fr)
  noticePeriodOptions: NoticePeriod[] = []
  noticePeriodKeyAccessor: (e:NoticePeriod) => string = (option: NoticePeriod) => 
    (this.lang=="en" ? option.name : option.name_fr)
  mobilityKeyAccessor: (e:MobilityEntity) => string = (option: MobilityEntity) =>
    (this.lang=="fr" ? option.name : option.nameFr) // !!! CAUTION, the language is reversed from the back-end
  languageOptionsKeyAccessor = (language: LanguageEntity):string =>
    this.lang == "en" ? language.name : (language.nameFr||language.name) as string
  countryKeyAccessor = (country: any) => country?.name

  skillOptionsKeyAccessor = (skill:SkillEntity)=>skill.name;

  constructor(
    private cs: ContentService,
    private storage: Storage,
    private translate: TranslateService,
  ) { 
    this.mobilityOptionsCache = new StoredData<MobilityEntity[]>('mobilityOptions', storage)
    this.lang = (this.translate.currentLang.includes("fr") ? "fr" : "en") as "en"|"fr"
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

  public onSkillOptions(allowPartial = false): Observable<SkillEntity[]> {
    let outputSubject = new BehaviorSubject<SkillEntity[]>([]);
    let output$ = outputSubject.asObservable();
    
    // Load all skill types
    this.cs.get_exp_fullurl(`https://web.kakoo-software.com/kakoo-back-end/api/v1/skill/get-all-skill-type`, {}, false)
      .pipe(
        catchError((error) => throwError(error)),
        switchMap((skillTypes: SkillTypeEntity[]) => {
          let loaders$ = skillTypes.map(skillType =>
            this.cs.get_exp_fullurl(`https://web.kakoo-software.com/kakoo-back-end/api/v1/skill/get-all-skill?skillTypeId=${skillType.id}`, {}, false)
          );
  
          if (allowPartial) {
            // Emit each response as it arrives
            return merge(...loaders$).pipe(
              tap((partialSkills: SkillEntity[]) => {
                outputSubject.next([...outputSubject.getValue(), ...partialSkills]);
              })
            );
          } else {
            // Wait for all requests to complete
            return forkJoin(loaders$).pipe(
              tap((allSkills: SkillEntity[][]) => {
                const combinedSkills = (allSkills as any).flat();
                outputSubject.next(combinedSkills);
              })
            );
          }
        })
      )
      .subscribe();
  
    return output$;
  }
}
