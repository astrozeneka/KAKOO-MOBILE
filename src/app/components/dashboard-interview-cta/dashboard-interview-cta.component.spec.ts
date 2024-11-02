import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DashboardInterviewCtaComponent } from './dashboard-interview-cta.component';

describe('DashboardInterviewCtaComponent', () => {
  let component: DashboardInterviewCtaComponent;
  let fixture: ComponentFixture<DashboardInterviewCtaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardInterviewCtaComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardInterviewCtaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
