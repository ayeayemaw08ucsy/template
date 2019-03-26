import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserMatrixComponent } from './user-matrix.component';

describe('UserMatrixComponent', () => {
  let component: UserMatrixComponent;
  let fixture: ComponentFixture<UserMatrixComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserMatrixComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserMatrixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
