import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupApproveComponent } from './setup-approve.component';

describe('SetupApproveComponent', () => {
  let component: SetupApproveComponent;
  let fixture: ComponentFixture<SetupApproveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetupApproveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetupApproveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
