import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ProfileSocialMediaLinksCardComponent } from './profile-social-media-links-card.component';

describe('ProfileSocialMediaLinksCardComponent', () => {
  let component: ProfileSocialMediaLinksCardComponent;
  let fixture: ComponentFixture<ProfileSocialMediaLinksCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileSocialMediaLinksCardComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileSocialMediaLinksCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
