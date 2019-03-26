import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchDeleteDialogComponent } from './branch-delete-dialog.component';

describe('BranchDeleteDialogComponent', () => {
  let component: BranchDeleteDialogComponent;
  let fixture: ComponentFixture<BranchDeleteDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BranchDeleteDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchDeleteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
