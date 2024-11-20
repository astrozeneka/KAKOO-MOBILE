import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RejectJobFormPage } from './reject-job-form.page';

describe('RejectJobFormPage', () => {
  let component: RejectJobFormPage;
  let fixture: ComponentFixture<RejectJobFormPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RejectJobFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
