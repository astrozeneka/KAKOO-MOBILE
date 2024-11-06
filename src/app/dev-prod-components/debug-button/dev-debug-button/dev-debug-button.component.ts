import { Component, OnInit } from '@angular/core';
import { ProdDebugButtonComponent } from '../prod-debug-button/prod-debug-button.component';
import { IonButton, IonIcon } from "@ionic/angular/standalone";
// Import ionic icons bug-outline
import { bugOutline } from 'ionicons/icons';
import { ActionSheetController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { environment } from 'src/environments/environment';


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
    private storage: Storage
  ) { 
    super();
  }

  override ngOnInit() {
    
  }

  // Action 1. Clear Cache
  async clearCache(){
    // List all index in the storage
    let keys = (await this.storage.keys()).filter(v=>v.startsWith(environment.cachePrefix));
    keys.forEach(key=>{
      this.storage.remove(key)
    })

  }

  async presentActionSheet(){
    let as = await this.actionSheetController.create({
      'header': 'Debug',
      'buttons': [
        ...(this.tools.includes('clearCache') ? [{
          'text': 'Clear Cache',
          'icon': 'trash',
          'handler': () => {
            this.clearCache()
          }
        }]: [])
      ]
    })
    await as.present();


  }
}