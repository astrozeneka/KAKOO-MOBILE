import { TranslateService } from "@ngx-translate/core";
import {AlertController} from "@ionic/angular";
import { BehaviorSubject, from, Observable } from "rxjs";
import { ContentService } from "../services/content.service";

export interface DeletableEntity {
    deleteIsLoadingSubject: BehaviorSubject<boolean>; // Unused
    deleteIsLoading$: Observable<boolean>;            // Unused
    fadeAwaySubject: BehaviorSubject<boolean>;
    fadeAway$: Observable<boolean>;
}


export const createDeletePrompt = (deletable: DeletableEntity, alertController: AlertController, t: TranslateService, cs:ContentService) => {
    return from(new Promise(async(resolve, reject)=>{
        const alert = await alertController.create({
            header: await t.instant('Confirm'),
            message: await t.instant('Are you sure you want to delete this item?'),
            buttons: [
                {
                    text: await t.instant('Cancel'),
                    role: 'cancel',
                    cssClass: 'secondary'
                },
                {
                    text: await t.instant('Okay'),
                    handler: () => {
                        // deletable.deleteIsLoadingSubject.next(true); // Unused
                        // Perform deletion here
                        resolve(true);
                    }
                }
            ]
        })
        await alert.present();
    }))

    // Return an observable
}