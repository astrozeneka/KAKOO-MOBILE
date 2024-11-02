import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DashboardRecommendedJobCardComponent } from './dashboard-recommended-job-card.component';

describe('DashboardRecommendedJobCardComponent', () => {
  let component: DashboardRecommendedJobCardComponent;
  let fixture: ComponentFixture<DashboardRecommendedJobCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardRecommendedJobCardComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardRecommendedJobCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
