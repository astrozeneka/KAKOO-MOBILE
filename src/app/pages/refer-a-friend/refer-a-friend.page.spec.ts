import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReferAFriendPage } from './refer-a-friend.page';

describe('ReferAFriendPage', () => {
  let component: ReferAFriendPage;
  let fixture: ComponentFixture<ReferAFriendPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferAFriendPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
