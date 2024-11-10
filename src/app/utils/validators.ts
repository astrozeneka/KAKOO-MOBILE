
import { AbstractControl } from "@angular/forms"

export const UrlValidator = (control: AbstractControl) => {
    const value = control.value as string
    if (!value) return null
    const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/
    if (!urlPattern.test(value)) return { url: true }
    return null
}

export const YearValidator = (control: AbstractControl) => {
    const value = control.value as string
    if (!value) return null
    const yearPattern = /^\d{4}$/
    if (!yearPattern.test(value)) return { year: true }
    return null
}