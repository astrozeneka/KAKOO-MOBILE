import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CertificationFormPage } from './certification-form.page';

describe('CertificationFormPage', () => {
  let component: CertificationFormPage;
  let fixture: ComponentFixture<CertificationFormPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CertificationFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
