import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MeetingOverviewPage } from './meeting-overview.page';

describe('MeetingOverviewPage', () => {
  let component: MeetingOverviewPage;
  let fixture: ComponentFixture<MeetingOverviewPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetingOverviewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
