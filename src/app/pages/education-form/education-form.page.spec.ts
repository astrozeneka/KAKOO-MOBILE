import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EducationAndCertificationFormPage } from './education-form.page';

describe('EducationAndCertificationFormPage', () => {
  let component: EducationAndCertificationFormPage;
  let fixture: ComponentFixture<EducationAndCertificationFormPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EducationAndCertificationFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
