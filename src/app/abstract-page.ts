import { Router } from "@angular/router";

export class AbstractPage {

    constructor(
        private _router: Router
    ){
        // Here should manage the device theme is dark mode or light mode
    }

    goTo(url: string) {
        this._router.navigate([url]);
    }
}