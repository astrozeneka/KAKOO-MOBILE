import { Router } from "@angular/router";

export class AbstractPage {

    constructor(
        private _router: Router
    ){
        
    }

    goTo(url: string) {
        this._router.navigate([url]);
    }
}