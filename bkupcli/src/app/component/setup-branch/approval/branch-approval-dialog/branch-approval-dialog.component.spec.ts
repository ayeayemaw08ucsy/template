import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchApprovalDialogComponent } from './branch-approval-dialog.component';

describe('BranchApprovalDialogComponent', () => {
  let component: BranchApprovalDialogComponent;
  let fixture: ComponentFixture<BranchApprovalDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BranchApprovalDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchApprovalDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
