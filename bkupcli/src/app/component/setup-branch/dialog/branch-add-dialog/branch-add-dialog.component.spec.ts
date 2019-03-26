import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchAddDialogComponent } from './branch-add-dialog.component';

describe('BranchAddDialogComponent', () => {
  let component: BranchAddDialogComponent;
  let fixture: ComponentFixture<BranchAddDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BranchAddDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchAddDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
