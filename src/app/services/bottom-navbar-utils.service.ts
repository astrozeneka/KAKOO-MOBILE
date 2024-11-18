import { Injectable } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BottomNavbarUtilsService {
  bottomNavbarAvailable: boolean = true // Update later


  tabSequences = ['dashboard', 'meetings', 'jobboard', 'referrals', 'more-29']
  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((e)=>{
        if (this.tabSequences.map(e => '/' + e === this.router.url).includes(true)) {
          this.bottomNavbarAvailable = true
        } else {
          this.bottomNavbarAvailable = false
        }
        console.log(this.bottomNavbarAvailable)
      })
  }
}
