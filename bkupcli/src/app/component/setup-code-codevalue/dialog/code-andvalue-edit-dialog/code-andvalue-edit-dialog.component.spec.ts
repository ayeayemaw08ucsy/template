import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeAndvalueEditDialogComponent } from './code-andvalue-edit-dialog.component';

describe('CodeAndvalueEditDialogComponent', () => {
  let component: CodeAndvalueEditDialogComponent;
  let fixture: ComponentFixture<CodeAndvalueEditDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CodeAndvalueEditDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CodeAndvalueEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
