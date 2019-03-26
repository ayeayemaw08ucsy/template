import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DepreciationpolicyAddDialogComponent } from './depreciationpolicy-add-dialog.component';

describe('DepreciationpolicyAddDialogComponent', () => {
  let component: DepreciationpolicyAddDialogComponent;
  let fixture: ComponentFixture<DepreciationpolicyAddDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DepreciationpolicyAddDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepreciationpolicyAddDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
