import { ComponentFactoryResolver, Injectable, ViewContainerRef } from '@angular/core';
import { ContentService } from './content.service';
import {ModalController, ToastController} from "@ionic/angular";
import { NavigationEnd, Router } from '@angular/router';
import StoredData from '../submodules/stored-data/StoredData';
import { Storage } from '@ionic/storage-angular';
import { BehaviorSubject, filter } from 'rxjs';
import { SuccessMessageComponent } from '../components/success-message/success-message.component';

export interface Feedback {
  message: string
  color?: string|undefined
  type: 'toast' | 'application-sent' | null // toast (other types can be added later)
  buttonText?: string | null // (UNUSED) text for the Button (only for modals)
  position?: "top" | "bottom" | "middle" | null // top, bottom, center
  positionAnchor?: string | HTMLElement | undefined // (experimental feature)
}

export interface SuccessFeedback extends Feedback {
  subtitle: string,
  buttonText: string
  buttonLink: string
}

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  feedbackData: StoredData<Feedback>

  displayFeedbackSubject: BehaviorSubject<Feedback> = new BehaviorSubject(null as any)
  displayFeedback$ = this.displayFeedbackSubject.asObservable()


  constructor(
    private cs: ContentService,
    private storage: Storage,
    private toastController: ToastController,
    // private modalController: ModalController, (the Modal is not compatible with the actualv ersion)
    private router: Router,
    private resolver: ComponentFactoryResolver
  ) { 
    this.feedbackData = new StoredData<Feedback>("feedback", storage)

    // Initialize the router to allow display feedback
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(async (e)=>{
        let feedback = await this.feedbackData.get()
        if (feedback) {
          this.displayFeedback(feedback)
        }
      })
  }

  async register(feedback:Feedback) {
    await this.feedbackData.set(feedback)
  }

  async registerNow(feedback:Feedback) {
    this.displayFeedback(feedback)
  }

  private async displayFeedback(feedback:Feedback) {
    if(feedback.type == 'toast'){
      let toast = await this.toastController.create({
        message: feedback.message,
        position: feedback.position || 'top',
        color: feedback.color,
        duration: 2000,
        positionAnchor: feedback.positionAnchor
      })
      await toast.present()
      // set cache data to null
      await this.feedbackData.set(null as any)
    }else if(feedback.type == 'application-sent'){
      // Only available for job-detail-page, so we need to delegate function
      // Create the custom component
      this.displayFeedbackSubject.next(feedback)
    }
  }
}
