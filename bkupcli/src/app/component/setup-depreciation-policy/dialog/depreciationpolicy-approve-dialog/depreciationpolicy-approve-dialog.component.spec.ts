import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DepreciationpolicyApproveDialogComponent } from './depreciationpolicy-approve-dialog.component';

describe('DepreciationpolicyApproveDialogComponent', () => {
  let component: DepreciationpolicyApproveDialogComponent;
  let fixture: ComponentFixture<DepreciationpolicyApproveDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DepreciationpolicyApproveDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepreciationpolicyApproveDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
