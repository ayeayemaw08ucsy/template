import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeAndvalueDeleteDialogComponent } from './code-andvalue-delete-dialog.component';

describe('CodeAndvalueDeleteDialogComponent', () => {
  let component: CodeAndvalueDeleteDialogComponent;
  let fixture: ComponentFixture<CodeAndvalueDeleteDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CodeAndvalueDeleteDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CodeAndvalueDeleteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
