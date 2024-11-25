import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConnectLinkedinPage } from './connect-linkedin.page';

describe('ConnectLinkedinPage', () => {
  let component: ConnectLinkedinPage;
  let fixture: ComponentFixture<ConnectLinkedinPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectLinkedinPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
