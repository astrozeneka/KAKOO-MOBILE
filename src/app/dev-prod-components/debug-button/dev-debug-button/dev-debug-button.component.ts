import { Component, OnInit } from '@angular/core';
import { ProdDebugButtonComponent } from '../prod-debug-button/prod-debug-button.component';
import { IonButton, IonIcon } from "@ionic/angular/standalone";
// Import ionic icons bug-outline
import { bugOutline } from 'ionicons/icons';
import { ActionSheetController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { ContentService } from 'src/app/services/content.service';


@Component({
  selector: 'app-debug-button',
  templateUrl: './dev-debug-button.component.html',
  styleUrls: ['./dev-debug-button.component.scss'],
  standalone: true,
  imports: [IonButton, IonIcon]
})
export class DevDebugButtonComponent extends ProdDebugButtonComponent implements OnInit {
  bugOutline = bugOutline;

  constructor(
    private actionSheetController: ActionSheetController,
    private storage: Storage,
    private router: Router,
    private cs: ContentService
  ) { 
    super();
  }

  override ngOnInit() {
    
  }

  // Action 1. Clear Cache
  async clearCache(){
    // List all index in the storage
    let keys = (await this.storage.keys()).filter(v=>v.startsWith(environment.cachePrefix));
    //keys = [...keys, 'token']
    keys.forEach(key=>{
      this.storage.remove(key)
    })
    console.log("Cache cleared: " + keys)
  }

  async unvalidateToken(){
    this.cs.token.set(null as any)
  }

  async presentActionSheet(){

    // Quick Navigation buttons
    let quickNavTools = this.tools.filter(v=>v.includes('quick-navigate'))
    let quickNavButtons = quickNavTools.map(v=>{
      let uri = v.split(":")[1].trim()
      return {
        'text': 'Go to ' + uri,
        'icon': 'arrow-forward',
        'handler': () => {
          this.router.navigateByUrl(uri)
        }
      }
    })

    let as = await this.actionSheetController.create({
      'header': 'Debug',
      'buttons': [
        ...(this.tools.includes('clearCache') ? [{
          'text': 'Clear Cache',
          'handler': () => {
            this.clearCache()
          }
        }]: []),
        ...(this.tools.includes('unvalidate-token') ? [{
          'text': 'Unvalidate Token',
          'handler': () => {
            this.unvalidateToken()
          }
        }]: []),
        ...quickNavButtons
      ]
    })
    await as.present();


  }
}
