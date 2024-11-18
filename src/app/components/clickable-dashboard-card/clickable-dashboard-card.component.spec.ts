import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ClickableDashboardCardComponent } from './clickable-dashboard-card.component';

describe('ClickableDashboardCardComponent', () => {
  let component: ClickableDashboardCardComponent;
  let fixture: ComponentFixture<ClickableDashboardCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ClickableDashboardCardComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ClickableDashboardCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
