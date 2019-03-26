import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeAndvalueApproveDialogComponent } from './code-andvalue-approve-dialog.component';

describe('CodeAndvalueApproveDialogComponent', () => {
  let component: CodeAndvalueApproveDialogComponent;
  let fixture: ComponentFixture<CodeAndvalueApproveDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CodeAndvalueApproveDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CodeAndvalueApproveDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
