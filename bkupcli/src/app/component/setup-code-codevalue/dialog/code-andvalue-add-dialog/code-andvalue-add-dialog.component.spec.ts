import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeAndvalueAddDialogComponent } from './code-andvalue-add-dialog.component';

describe('CodeAndvalueAddDialogComponent', () => {
  let component: CodeAndvalueAddDialogComponent;
  let fixture: ComponentFixture<CodeAndvalueAddDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CodeAndvalueAddDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CodeAndvalueAddDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
