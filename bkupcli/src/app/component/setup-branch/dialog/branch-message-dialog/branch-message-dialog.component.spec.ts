import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchMessageDialogComponent } from './branch-message-dialog.component';

describe('BranchMessageDialogComponent', () => {
  let component: BranchMessageDialogComponent;
  let fixture: ComponentFixture<BranchMessageDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BranchMessageDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchMessageDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
