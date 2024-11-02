import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DashboardRecommendedAssessmentCardComponent } from './dashboard-recommended-assessment-card.component';

describe('DashboardRecommendedAssessmentCardComponent', () => {
  let component: DashboardRecommendedAssessmentCardComponent;
  let fixture: ComponentFixture<DashboardRecommendedAssessmentCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardRecommendedAssessmentCardComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardRecommendedAssessmentCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
