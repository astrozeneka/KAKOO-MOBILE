import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EducationAndCertificationPage } from './education-and-certification.page';

describe('EducationAndCertificationPage', () => {
  let component: EducationAndCertificationPage;
  let fixture: ComponentFixture<EducationAndCertificationPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EducationAndCertificationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
