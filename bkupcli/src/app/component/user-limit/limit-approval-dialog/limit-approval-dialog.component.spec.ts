import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LimitApprovalDialogComponent } from './limit-approval-dialog.component';

describe('LimitApprovalDialogComponent', () => {
  let component: LimitApprovalDialogComponent;
  let fixture: ComponentFixture<LimitApprovalDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LimitApprovalDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LimitApprovalDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
