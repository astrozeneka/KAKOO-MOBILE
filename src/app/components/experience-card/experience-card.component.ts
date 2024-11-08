import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IonIcon, IonButton, IonSpinner } from "@ionic/angular/standalone";
import { Observable } from 'rxjs';
import { UxButtonComponent } from 'src/app/submodules/angular-ux-button/standalone/ux-button.component';

@Component({
  selector: 'app-experience-card',
  templateUrl: './experience-card.component.html',
  styleUrls: ['./experience-card.component.scss'],
  standalone: true,
  imports: [IonSpinner, IonButton, IonIcon, UxButtonComponent]
})
export class ExperienceCardComponent  implements OnInit {

  @Input() editButton:boolean = true;
  @Input() deleteButton:boolean = true;

  // The related edit and elete event
  @Output() edit:EventEmitter<any> = new EventEmitter();
  @Output() delete:EventEmitter<any> = new EventEmitter

  // Ux improving of the buttons
  @Input() deleteButtonIsLoading$:Observable<boolean> = new Observable();
  deleteButtonIsLoading:boolean = false;

  // Edit button (maybe not needed)

  // A fadeaway is needed when the item is about to be deleted for better UX
  @Input() fadeAway$:Observable<boolean> = new Observable();
  fadeAway: boolean = true;

  constructor(
    private cdr:ChangeDetectorRef
  ) { }

  ngOnInit() {
    // The delete button
    this.deleteButtonIsLoading$.subscribe((value:boolean) => {
      this.deleteButtonIsLoading = value
      this.cdr.detectChanges()
    })
    this.fadeAway$.subscribe((value:boolean) => {
      this.fadeAway = value
      this.cdr.detectChanges()
    })

    // Test (delete later)
  }

  editClicked(event:any){
    this.edit.emit(event);
  }

  deleteClicked(event:any){
    this.delete.emit(event)
  }

}
