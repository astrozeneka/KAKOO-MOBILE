import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  prefDark = window.matchMedia('(prefers-color-scheme: dark)');
  constructor() {
    Preferences.set({
      key: 'mode',
      value: this.prefDark.matches ? 'light' : 'dark',
    })
  }
}
