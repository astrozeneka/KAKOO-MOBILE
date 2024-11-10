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
          displayedError[key] = translate("Invalid email")
        } else if (form.controls[key].errors?.['phone']) {
          displayedError[key] = translate("Invalid phone number")
        } else if (form.controls[key].errors?.['minlength']) {
          displayedError[key] = translate("Too short")
        } else if (form.controls[key].errors?.['maxlength']) {
          displayedError[key] = translate("Too long")
        } else if (form.controls[key].errors?.['url']) {
          displayedError[key] = translate("Invalid URL")
        } else if (form.controls[key].errors?.['year']) {
          displayedError[key] = translate("Invalid year")
        } else if (form.controls[key].errors?.['email_exists']) {
          displayedError[key] = translate("Email already exists")
        } else if (form.controls[key].errors?.['phone_exists']) {
          displayedError[key] = translate("Phone number already exists")
        } else {
          console.warn("Unhandled validation error message " + key)
        }
      } else {
        displayedError[key] = undefined
      }
    }
  }