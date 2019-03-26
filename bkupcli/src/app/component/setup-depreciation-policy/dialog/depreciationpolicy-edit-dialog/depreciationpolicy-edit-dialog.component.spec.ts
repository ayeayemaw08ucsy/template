import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DepreciationpolicyEditDialogComponent } from './depreciationpolicy-edit-dialog.component';

describe('DepreciationpolicyEditDialogComponent', () => {
  let component: DepreciationpolicyEditDialogComponent;
  let fixture: ComponentFixture<DepreciationpolicyEditDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DepreciationpolicyEditDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepreciationpolicyEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
