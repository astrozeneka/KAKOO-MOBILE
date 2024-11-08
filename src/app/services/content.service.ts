import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { BehaviorSubject, filter, firstValueFrom, from, map, merge, Observable, switchMap } from 'rxjs';
import { environment } from 'src/environments/environment';
import StoredData from '../submodules/stored-data/StoredData';
import { AppLanguageService } from './app-language.service';
import { Candidate } from '../models/Candidate';

@Injectable({
  providedIn: 'root'
})
export class ContentService {
  token: StoredData<string>
  languageShortened:'fr'|'en' = 'en' // Set by external service (language service)
  candidateData: StoredData<Candidate>

  // Experimental features (candidate data rxjs subject)
  candidateDataSubject = new BehaviorSubject<Candidate|null>(null)
  candidateData$ = this.candidateDataSubject.asObservable()


  constructor(
    private http: HttpClient,
    private storage: Storage
  ) {
    this.storage.create()
    this.token = new StoredData<string>('token', this.storage)
    this.candidateData = new StoredData<Candidate>('candidateData', this.storage)

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
    return from(new Promise(async(resolve)=>{
      let token = await this.token.get()
      let hdrs ={
        ...headers,
        ...(token?{Authorization: token}:{})
      }
      // console.log(hdrs)
      resolve(firstValueFrom((this.http.get(`${environment.apiEndpoint}${uri}?language=${this.languageShortened}`, {
        headers: hdrs
      }))))
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
  requestCandidateDataRefresh(){
    this.candidateData.get().then((data)=>{
      let id = data?.candidateId
      if (id){
        this.get_exp(`/api/v2/self-candidate/get-by-id/${id}`, {})
          .subscribe((data: Candidate)=>{
            this.candidateData.set(data)
            this.candidateDataSubject.next(data)
          })
        }
      })
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
}
