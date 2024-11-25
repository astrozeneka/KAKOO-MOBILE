import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConnectGooglePage } from './connect-google.page';

describe('ConnectGooglePage', () => {
  let component: ConnectGooglePage;
  let fixture: ComponentFixture<ConnectGooglePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectGooglePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
