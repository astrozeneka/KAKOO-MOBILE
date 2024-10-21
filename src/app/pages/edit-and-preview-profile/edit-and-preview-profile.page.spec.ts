import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditAndPreviewProfilePage } from './edit-and-preview-profile.page';

describe('EditAndPreviewProfilePage', () => {
  let component: EditAndPreviewProfilePage;
  let fixture: ComponentFixture<EditAndPreviewProfilePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAndPreviewProfilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
