import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'zfill',
  standalone: true
})
export class ZfillPipe implements PipeTransform {
  transform(value: any, length: number = 2): string {
    if (value == null || isNaN(value)) return value;
    return value.toString().padStart(length, '0');
  }
}
