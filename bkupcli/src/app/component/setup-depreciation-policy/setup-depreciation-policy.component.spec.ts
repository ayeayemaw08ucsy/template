import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupDepreciationPolicyComponent } from './setup-depreciation-policy.component';

describe('SetupDepreciationPolicyComponent', () => {
  let component: SetupDepreciationPolicyComponent;
  let fixture: ComponentFixture<SetupDepreciationPolicyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetupDepreciationPolicyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetupDepreciationPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
