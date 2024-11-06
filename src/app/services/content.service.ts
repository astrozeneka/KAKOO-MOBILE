import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { firstValueFrom, from, map, Observable, switchMap } from 'rxjs';
import { environment } from 'src/environments/environment';
import StoredData from '../submodules/stored-data/StoredData';
import { AppLanguageService } from './app-language.service';

@Injectable({
  providedIn: 'root'
})
export class ContentService {
  token: StoredData<string>
  languageShortened:'fr'|'en' = 'en' // Set by external service (language service)

  constructor(
    private http: HttpClient,
    private storage: Storage
  ) {
    this.storage.create()
    this.token = new StoredData<string>('token', this.storage)

  }

  post(suffix: string, body: any) {
    // TODO later, fetch the header bearers from the local storage
    return this.http.post(`${environment.apiEndpoint}${suffix}`, body, {
      // later, add the header bearers
    })
  }

  // Experimental POST used to test the new system
  // Normally the JWT will be added to the bearer automatically
  post_exp(fullUrl: string, body: any) { // TODO, use suffix instead of fullUrl
    // console.log("languageShortened: " + this.languageShortened)
    // TODO later, fetch the header bearers from the local storage
    return this.http.post(`${fullUrl}?language=${this.languageShortened}`, body, {
      // later, add the header bearers
    })
  }

  get_exp(uri: string, headers: {[key: string]:any}): Observable<any>{
    return from(new Promise(async(resolve)=>{
      let token = await this.token.get()
      let hdrs ={
        ...headers,
        ...(token?{Authorization: token}:{})
      }
      console.log(hdrs)
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
}
