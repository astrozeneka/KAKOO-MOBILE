import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ProfileJobPreferencesCardComponent } from './profile-job-preferences-card.component';

describe('ProfileJobPreferencesCardComponent', () => {
  let component: ProfileJobPreferencesCardComponent;
  let fixture: ComponentFixture<ProfileJobPreferencesCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileJobPreferencesCardComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileJobPreferencesCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
