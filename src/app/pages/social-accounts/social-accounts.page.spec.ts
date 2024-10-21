import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SocialAccountsPage } from './social-accounts.page';

describe('SocialAccountsPage', () => {
  let component: SocialAccountsPage;
  let fixture: ComponentFixture<SocialAccountsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SocialAccountsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
