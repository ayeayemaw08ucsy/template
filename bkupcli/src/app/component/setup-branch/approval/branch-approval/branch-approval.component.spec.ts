import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchApprovalComponent } from './branch-approval.component';

describe('BranchApprovalComponent', () => {
  let component: BranchApprovalComponent;
  let fixture: ComponentFixture<BranchApprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BranchApprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
