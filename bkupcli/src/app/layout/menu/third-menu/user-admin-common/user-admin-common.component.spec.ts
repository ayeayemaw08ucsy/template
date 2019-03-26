import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAdminCommonComponent } from './user-admin-common.component';

describe('UserAdminCommonComponent', () => {
  let component: UserAdminCommonComponent;
  let fixture: ComponentFixture<UserAdminCommonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserAdminCommonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserAdminCommonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
