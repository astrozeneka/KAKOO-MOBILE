import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { JobDetailsEmployerQuestionsComponent } from './job-details-employer-questions.component';

describe('JobDetailsEmployerQuestionsComponent', () => {
  let component: JobDetailsEmployerQuestionsComponent;
  let fixture: ComponentFixture<JobDetailsEmployerQuestionsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ JobDetailsEmployerQuestionsComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(JobDetailsEmployerQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
