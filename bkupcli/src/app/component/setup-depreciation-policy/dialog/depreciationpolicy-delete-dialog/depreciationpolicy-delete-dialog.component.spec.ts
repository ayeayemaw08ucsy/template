import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DepreciationpolicyDeleteDialogComponent } from './depreciationpolicy-delete-dialog.component';

describe('DepreciationpolicyDeleteDialogComponent', () => {
  let component: DepreciationpolicyDeleteDialogComponent;
  let fixture: ComponentFixture<DepreciationpolicyDeleteDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DepreciationpolicyDeleteDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepreciationpolicyDeleteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
