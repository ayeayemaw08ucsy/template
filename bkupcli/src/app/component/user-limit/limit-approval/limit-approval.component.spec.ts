import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LimitApprovalComponent } from './limit-approval.component';

describe('LimitApprovalComponent', () => {
  let component: LimitApprovalComponent;
  let fixture: ComponentFixture<LimitApprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LimitApprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LimitApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
