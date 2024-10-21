import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmployerQuestionsPage } from './employer-questions.page';

describe('EmployerQuestionsPage', () => {
  let component: EmployerQuestionsPage;
  let fixture: ComponentFixture<EmployerQuestionsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployerQuestionsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
