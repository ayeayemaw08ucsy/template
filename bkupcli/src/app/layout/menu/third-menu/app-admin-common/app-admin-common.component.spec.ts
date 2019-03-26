import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppAdminCommonComponent } from './app-admin-common.component';

describe('AppAdminCommonComponent', () => {
  let component: AppAdminCommonComponent;
  let fixture: ComponentFixture<AppAdminCommonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppAdminCommonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppAdminCommonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
