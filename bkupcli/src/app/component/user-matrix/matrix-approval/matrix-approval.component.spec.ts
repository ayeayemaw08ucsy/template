import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatrixApprovalComponent } from './matrix-approval.component';

describe('MatrixApprovalComponent', () => {
  let component: MatrixApprovalComponent;
  let fixture: ComponentFixture<MatrixApprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatrixApprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatrixApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
