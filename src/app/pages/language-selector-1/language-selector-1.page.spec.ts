import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LanguageSelector1Page } from './language-selector-1.page';

describe('LanguageSelector1Page', () => {
  let component: LanguageSelector1Page;
  let fixture: ComponentFixture<LanguageSelector1Page>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LanguageSelector1Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
