import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkExperienceFormPage } from './work-experience-form.page';

describe('WorkExperienceFormPage', () => {
  let component: WorkExperienceFormPage;
  let fixture: ComponentFixture<WorkExperienceFormPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkExperienceFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
