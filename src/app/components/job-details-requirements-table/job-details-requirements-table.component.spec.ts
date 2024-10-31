import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { JobDetailsRequirementsTableComponent } from './job-details-requirements-table.component';

describe('JobDetailsRequirementsTableComponent', () => {
  let component: JobDetailsRequirementsTableComponent;
  let fixture: ComponentFixture<JobDetailsRequirementsTableComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ JobDetailsRequirementsTableComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(JobDetailsRequirementsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
