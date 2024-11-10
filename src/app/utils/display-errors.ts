import { FormGroup } from "@angular/forms"

export const displayErrors = (
  form:FormGroup, 
  displayedError:{[key:string]:string|undefined},
  translate:(v:string)=>string
) => {
    // For all items in the form
    for (let key in form.controls){
      // If the item is invalid
      if (form.controls[key].invalid){
        if (form.controls[key].errors?.['required']){
          displayedError[key] = translate("Required field")
        } else if (form.controls[key].errors?.['email']){
          displayedError[key] = "Invalid email"
        } else if (form.controls[key].errors?.['phone']) {
          displayedError[key] = "Invalid phone number"
        } else if (form.controls[key].errors?.['minlength']) {
          displayedError[key] = "Too short"
        } else if (form.controls[key].errors?.['maxlength']) {
          displayedError[key] = "Too long"
        } else if (form.controls[key].errors?.['url']) {
          displayedError[key] = "Invalid URL"
        } else {
          console.warn("Unhandled validation error message " + key)
        }
      } else {
        displayedError[key] = undefined
      }
    }
  }