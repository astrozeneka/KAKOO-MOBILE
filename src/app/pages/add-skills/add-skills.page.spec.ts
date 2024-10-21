import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddSkillsPage } from './add-skills.page';

describe('AddSkillsPage', () => {
  let component: AddSkillsPage;
  let fixture: ComponentFixture<AddSkillsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSkillsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
