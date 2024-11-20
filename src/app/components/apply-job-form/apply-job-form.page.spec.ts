import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApplyJobFormPage } from './apply-job-form.page';

describe('ApplyJobFormPage', () => {
  let component: ApplyJobFormPage;
  let fixture: ComponentFixture<ApplyJobFormPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplyJobFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
