import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CheckYourEmailPage } from './check-your-email.page';

describe('CheckYourEmailPage', () => {
  let component: CheckYourEmailPage;
  let fixture: ComponentFixture<CheckYourEmailPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckYourEmailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
