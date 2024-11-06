import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContentService {

  constructor(
    private http: HttpClient,
    private storage: Storage
  ) {
    this.storage.create()
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
    // TODO later, fetch the header bearers from the local storage
    return this.http.post(`${fullUrl}`, body, {
      // later, add the header bearers
    })
  }
}
