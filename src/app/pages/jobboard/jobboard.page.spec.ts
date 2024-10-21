import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JobboardPage } from './jobboard.page';

describe('JobboardPage', () => {
  let component: JobboardPage;
  let fixture: ComponentFixture<JobboardPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(JobboardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
