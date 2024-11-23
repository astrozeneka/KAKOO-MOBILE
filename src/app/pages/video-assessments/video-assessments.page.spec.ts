import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VideoAssessmentsPage } from './video-assessments.page';

describe('VideoAssessmentsPage', () => {
  let component: VideoAssessmentsPage;
  let fixture: ComponentFixture<VideoAssessmentsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoAssessmentsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
