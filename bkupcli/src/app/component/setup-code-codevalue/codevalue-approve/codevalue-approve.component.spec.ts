import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CodevalueApproveComponent } from './codevalue-approve.component';

describe('CodevalueApproveComponent', () => {
  let component: CodevalueApproveComponent;
  let fixture: ComponentFixture<CodevalueApproveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CodevalueApproveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CodevalueApproveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
