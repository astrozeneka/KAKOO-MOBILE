import { Router } from "@angular/router";

export class BottomNavbarTarget {
    public tabName: 'dashboard'|'meetings'|'jobboard'|'referrals'|'more'|null = null

    constructor(public router: Router) {
        (['dashboard', 'meetings', 'jobboard', 'referrals', 'more']).forEach(tab => {
            if (this.router.url.includes(tab))
                this.tabName = tab as any
        })
        if (!this.tabName)
            console.error('Tab name not found')
    }
}