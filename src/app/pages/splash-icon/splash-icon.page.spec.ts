import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SplashIconPage } from './splash-icon.page';

describe('SplashIconPage', () => {
  let component: SplashIconPage;
  let fixture: ComponentFixture<SplashIconPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SplashIconPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
