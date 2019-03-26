import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatrixApprovalDialogComponent } from './matrix-approval-dialog.component';

describe('MatrixApprovalDialogComponent', () => {
  let component: MatrixApprovalDialogComponent;
  let fixture: ComponentFixture<MatrixApprovalDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatrixApprovalDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatrixApprovalDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
