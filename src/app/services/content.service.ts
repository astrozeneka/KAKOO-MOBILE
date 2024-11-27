import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { BehaviorSubject, catchError, filter, firstValueFrom, from, map, merge, Observable, switchMap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import StoredData from '../submodules/stored-data/StoredData';
import { AppLanguageService } from './app-language.service';
import { Candidate } from '../models/Candidate';
import { Router } from '@angular/router';
import { User } from '../models/User';
import { ProfileDataService } from './profile-data.service';

@Injectable({
  providedIn: 'root'
})
export class ContentService {
  token: StoredData<string>
  languageShortened:'fr'|'en' = 'en' // Set by external service (language service)

  // Experimental features (candidate data rxjs subject)
  candidateData: StoredData<Candidate>
  candidateDataSubject = new BehaviorSubject<Candidate|null>(null)
  candidateData$ = this.candidateDataSubject.asObservable()

  userData: StoredData<User>
  userDataSubject = new BehaviorSubject<User|null>(null)
  userData$ = this.userDataSubject.asObservable()


  constructor(
    private http: HttpClient,
    private storage: Storage,
    private router: Router,
  ) {
    this.storage.create()
    this.token = new StoredData<string>('token', this.storage)
    this.candidateData = new StoredData<Candidate>('candidateData', this.storage)
    this.userData = new StoredData<User>('userData', this.storage)
    // Experimental feature for the candidate data
  }

  post(suffix: string, body: any) {
    // TODO later, fetch the header bearers from the local storage
    return this.http.post(`${environment.apiEndpoint}${suffix}`, body, {
      // later, add the header bearers
    })
  }

  // Experimental POST used to test the new system
  // Normally the JWT will be added to the bearer automatically
  post_exp(uri: string, data:any ,headers: {[key: string]:any}): Observable<any> { // TODO, use suffix instead of fullUrl
    return from(new Promise(async(resolve)=>{
      let token = await this.token.get()
      let hdrs ={
        ...headers,
        ...(token?{Authorization: token}:{})
      }
      resolve(firstValueFrom((this.http.post(`${environment.apiEndpoint}${uri}?language=${this.languageShortened}`, data, {
        headers: hdrs
      }))))
    }))
  }

  delete_exp(uri: string, headers: {[key: string]:any}): Observable<any> {
    return from(new Promise(async(resolve)=>{
      let token = await this.token.get()
      let hdrs ={
        ...headers,
        ...(token?{Authorization: token}:{})
      }
      resolve(firstValueFrom((this.http.delete(`${environment.apiEndpoint}${uri}`, {
        headers: hdrs
      }))))
    }))
  }

  patch_exp(uri: string, data:any ,headers: {[key: string]:any}): Observable<any>{
    return from(new Promise(async(resolve)=>{
      let token = await this.token.get()
      let hdrs ={
        ...headers,
        ...(token?{Authorization: token}:{})
      }
      resolve(firstValueFrom((this.http.patch(`${environment.apiEndpoint}${uri}?language=${this.languageShortened}`, data, {
        headers: hdrs
      }))))
    }))
  }

  put_exp(uri: string, data:any ,headers: {[key: string]:any}): Observable<any>{
    return from(new Promise(async(resolve)=>{
      let token = await this.token.get()
      let hdrs ={
        ...headers,
        ...(token?{Authorization: token}:{})
      }
      resolve(firstValueFrom((this.http.put(`${environment.apiEndpoint}${uri}?language=${this.languageShortened}`, data, {
        headers: hdrs
      }))))
    }))
  }

  get_exp(uri: string, headers: {[key: string]:any}): Observable<any>{
    return from(new Promise(async(resolve, reject)=>{
      let token = await this.token.get()
      let hdrs ={
        ...headers,
        ...(token?{Authorization: token}:{})
      }
      try{
        const response = await firstValueFrom(
          this.http.get(`${environment.apiEndpoint}${uri}?language=${this.languageShortened}`, {
            headers: hdrs
          }).pipe(catchError((error)=>{
            return throwError(error)
          }))
        )
        resolve(response)
      }catch(error:any){
        if (error.status === 500){
          this.router.navigateByUrl('/login?error=session-expired')
        }
        reject(error)
      }
    }));
    // print token
    /*
    (async()=>{
      console.log("Token: " + await this.token.get())
    })();
    return;
    return this.http.get(`${environment.apiEndpoint}${uri}?language=${this.languageShortened}`, {
      ...options
    })
      */
  }

  get_exp_fullurl(fullurl: string, headers: {[key: string]:any}, authenticated=true): Observable<any>{
    return from(new Promise(async(resolve)=>{
      let token = await this.token.get()
      let hdrs ={
        ...headers,
        ...((token && authenticated)?{Authorization: token}:{})
      }
      // Additionnal options can be suffixed to the URL
      resolve(firstValueFrom((this.http.get(fullurl, {
        headers: hdrs
      }))))
    }))
  }

  post_exp_fullurl(fullurl: string, data:any ,headers: {[key: string]:any}): Observable<any>{
    return from(new Promise(async(resolve)=>{
      let token = await this.token.get()
      let hdrs ={
        ...headers,
        ...(token?{Authorization: token}:{})
      }
      resolve(firstValueFrom((this.http.post(fullurl, data, {
        headers: hdrs
      }))))
    }))
  }

  put_exp_fullurl(fullurl: string, data:any ,headers: {[key: string]:any}): Observable<any>{
    return from(new Promise(async(resolve)=>{
      let token = await this.token.get()
      let hdrs ={
        ...headers,
        ...(token?{Authorization: token}:{})
      }
      resolve(firstValueFrom((this.http.put(fullurl, data, {
        headers: hdrs
      }))))
    }))
  }

  delete_exp_fullurl(fullurl: string, headers: {[key: string]:any}): Observable<any>{
    return from(new Promise(async(resolve)=>{
      let token = await this.token.get()
      let hdrs ={
        ...headers,
        ...(token?{Authorization: token}:{})
      }
      resolve(firstValueFrom((this.http.delete(fullurl, {
        headers: hdrs
      }))))
    }))
  }

  requestLogin(data:{username:string, password:string}){
    return this.http.post(
      // Language proof
      `${environment.apiEndpoint}/login?language=fr`, data, {observe: 'response'}
    )
      .pipe(switchMap((response, i) => {
        // Return an observable
        return from(new Promise(async(resolve)=>{
          if (response.headers.get('Authorization')){
            await this.token.set(response.headers.get('Authorization')!)
            console.log("Token set")
            resolve(response)
          }
        }))
      }))
      
    
      /*.pipe(map((response: HttpResponse<any>)=>{
        if (response.headers.get('Authorization')){
          this.token.set(response.headers.get('Authorization')!)
          console.log("Token set")
        }
      }))*/
  }

  // Experimental feature for cached data app
  registerCandidateDataObserverV2(getFromCache=true, getFromServer=true): Observable<Candidate|null>{
    let additionalEventsSubject = new BehaviorSubject<Candidate|null>(null)
    let additionalEvents$ = additionalEventsSubject.asObservable()

    // 1. Fire the cached data
    this.candidateData.get().then((data)=>{
      if (getFromCache)
        additionalEventsSubject.next(data)
      if (getFromServer) {
        // 2. Call the server, then fire the server data to the same observer
        let id = data?.candidateId
        if (id){
          this.get_exp(`/api/v2/self-candidate/get-by-id/${id}`, {})
            .subscribe((data: Candidate)=>{
              additionalEventsSubject.next(data)

              // 3. Update the cache
              this.candidateData.set(data)
            })
          }
      }
    })

    let output$ = merge(this.candidateData$, additionalEvents$)
    output$ = output$.pipe(filter((data)=>data!=null))
    return output$
  }
  async requestCandidateDataRefresh(){
    this.get_exp(`/api/v1/self-candidate`, {})
      .pipe(catchError((error:{header:any, status:any, statusText:any, url:any, ok:any})=>{
        if (error.status === 400 && this.router.url !== '/welcome'){
          this.router.navigateByUrl('/login?error=session-expired')
        }else {
          console.log("Unable to fetch the candidate, probably first time") // Unused, can be deleted
        }
        this.candidateDataSubject.next({} as any)
        return throwError(()=>error)
      }))
      .subscribe((data: Candidate)=>{
        this.candidateData.set(data)
        this.candidateDataSubject.next(data)
      })
    /*
    let candidateId = (await this.candidateData.get())?.candidateId ||
      (await this.userData.get())?.candidateId
    if (candidateId){
      this.get_exp(`/api/v2/self-candidate/get-by-id/${candidateId}`, {})
        .subscribe((data: Candidate)=>{
          this.candidateData.set(data)
          this.candidateDataSubject.next(data)
        })
    }
    */
  }

  async requestUserDataRefresh(){
    this.get_exp(`/api/v1/self-candidate/get-user`, {})
      .pipe(catchError(error => throwError(error)))
      .subscribe(async (data: User)=>{
        await this.userData.set(data)
        this.userDataSubject.next(data)
      })
  }

  // Another endpoint is used here, but doesn't handle if the user has just created an account
  registerCandidateDataObserverV3(getFromCache=true, getFromServer=true): Observable<Candidate|null>{
    let additionalEventsSubject = new BehaviorSubject<Candidate|null>(null)
    let additionalEvents$ = additionalEventsSubject.asObservable()

    // 1. Fire the cached data
    this.candidateData.get().then((data)=>{
      if (getFromCache)
        additionalEventsSubject.next(data)
    })

    // 2. Fire from the server
    if (getFromServer) {
      this.get_exp(`/api/v1/self-candidate`, {})
        .pipe(catchError((error:{header:any, status:any, statusText:any, url:any, ok:any})=>{
          if (error.status === 400 && this.router.url !== '/welcome'){
            this.router.navigateByUrl('/login?error=session-expired')
          }else if (error.status === 404){
            console.log("Unable to fetch the candidate, probably first time") // Unused, can be deleted
          }else{
            console.log("Unable to fetch the candidate, probably first time") // Unused, can be deleted
          }
          this.candidateDataSubject.next({} as any)
          return throwError(error)
        }))
        .subscribe((data: Candidate)=>{
          additionalEventsSubject.next(data)
          // 3. Update the cache
          this.candidateData.set(data)
        })
    }
    let output$ = merge(this.candidateData$, additionalEvents$)
    output$ = output$.pipe(filter((data)=>data!=null))
    return output$
  }

  // Same architecture as registerCandidateDataObserverV2 but for id
  registerUserDataObserver(getFromCache=true, getFromServer=true):Observable<User|null>{
    let additionalEventsSubject = new BehaviorSubject<User|null>(null)
    let additionalEvents$ = additionalEventsSubject.asObservable()

    // 1. Fire the cached data
    if (getFromCache)
    this.userData.get().then((data)=>{
        additionalEventsSubject.next(data)
    })

    // 2. Call the server, then fire the server data to the same observer
    // no id needed, only the bearer token
    if (getFromServer) {
      this.get_exp(`/api/v1/self-candidate/get-user`, {})
        .subscribe(async (data: User)=>{
          // 3. Update the cache
          console.log(data)
          await this.userData.set(data)
          additionalEventsSubject.next(data)
        })
    }

    let output$ = merge(this.userData$, additionalEvents$)
    output$ = output$.pipe(filter((data)=>data!=null))
    return output$
  }

  
  // Experimental features
  /*registerCandidateDataObserver(): Observable<Candidate|null>{
    let outputSubject = new BehaviorSubject<Candidate|null>(null)
    let output$ = outputSubject.asObservable()

    // 1. Fire the cached data
    this.candidateData.get().then((data)=>{
      outputSubject.next(data)

      // 2. Call the server, then fire the server data to the same observer
      let id = data?.candidateId
      if (id){
        this.get_exp(`/api/v2/self-candidate/get-by-id/${id}`, {})
          .subscribe((data: Candidate)=>{
            outputSubject.next(data)

            // 3. Update the cache
            this.candidateData.set(data)
          })
      }
    })

    output$ = output$.pipe(filter((data)=>data!=null))
    return output$
  }*/

  async logout(){
    // Same architecture as in training-day
    await this.token.set('')
    await this.candidateData.set(null as any)
    await this.userData.set(null as any)
    this.router.navigate(['/login'])
  }
}
