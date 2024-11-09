import { catchError, Observable, throwError } from "rxjs"
import { ContentService } from "../services/content.service"


export const catch400Error = (cs: ContentService) => {
    return catchError<any, any>((error) => { // The typing is not valid
        if (error.status == 400) { // Token invalid
            cs.logout()
        }
        console.log(error)
        return throwError(error)
    })
}