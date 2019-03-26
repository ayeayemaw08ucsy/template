import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsermatrixDialogComponent } from './usermatrix-dialog.component';

describe('UsermatrixDialogComponent', () => {
  let component: UsermatrixDialogComponent;
  let fixture: ComponentFixture<UsermatrixDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsermatrixDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsermatrixDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
