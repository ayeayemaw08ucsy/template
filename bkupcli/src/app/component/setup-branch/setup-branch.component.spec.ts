import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupBranchComponent } from './setup-branch.component';

describe('SetupBranchComponent', () => {
  let component: SetupBranchComponent;
  let fixture: ComponentFixture<SetupBranchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetupBranchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetupBranchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
