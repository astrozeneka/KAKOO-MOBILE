import { Component, Input, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { IonButton, IonIcon } from '@ionic/angular/standalone';
import { I18nPipeShortened } from 'src/app/i18n.pipe';
import { NavController } from '@ionic/angular';
import { filter } from 'rxjs';

@Component({
  selector: 'app-bottom-navbar',
  templateUrl: './bottom-navbar.component.html',
  styleUrls: ['./bottom-navbar.component.scss'],
  standalone: true,
  imports: [IonButton, IonIcon, I18nPipeShortened]
})
export class BottomNavbarComponent  implements OnInit {
  @Input() tabName: string|null = null
  tabSequences = ['dashboard', 'meetings', 'jobboard', 'referrals', 'more-29']
  @Input() fixedMode: boolean = false

  constructor(
    public router: Router,
    public navController: NavController
  ) { }

  ngOnInit() {
    if (this.fixedMode){
      this.router.events
        .pipe(filter((event) => event instanceof NavigationEnd))
        .pipe(filter((e) => this.tabSequences.map(e => '/' + e === this.router.url).includes(true)))
        .subscribe((e)=>{
          this.tabName = this.router.url.replace('/', '')
        })
    }
  }

  goToTab(target:string) { // Experimental (to be updated later)
    console.log(target, this.tabName)
    console.log(this.tabSequences.indexOf(target), this.tabSequences.indexOf(this.tabName!))
    if (this.tabSequences.indexOf(target) < this.tabSequences.indexOf(this.tabName || 'dashboard')) {
      console.log("back")
      this.navController.navigateBack(['/' + target], { animated: true, animationDirection: 'back' });
    } else {
      console.log("forward")
      this.navController.navigateForward(['/' + target], { animated: true, animationDirection: 'forward' });
    }


    // this.navController.navigateRoot('/dashboard', { animated: true, animationDirection: 'back' });
  }

}
