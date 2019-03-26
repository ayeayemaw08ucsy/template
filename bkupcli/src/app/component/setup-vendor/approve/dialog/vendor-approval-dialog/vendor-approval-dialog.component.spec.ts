import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorApprovalDialogComponent } from './vendor-approval-dialog.component';

describe('VendorApprovalDialogComponent', () => {
  let component: VendorApprovalDialogComponent;
  let fixture: ComponentFixture<VendorApprovalDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorApprovalDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorApprovalDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
