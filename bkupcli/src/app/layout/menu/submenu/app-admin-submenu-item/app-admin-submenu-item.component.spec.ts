import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppAdminSubmenuItemComponent } from './app-admin-submenu-item.component';

describe('AppAdminSubmenuItemComponent', () => {
  let component: AppAdminSubmenuItemComponent;
  let fixture: ComponentFixture<AppAdminSubmenuItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppAdminSubmenuItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppAdminSubmenuItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
