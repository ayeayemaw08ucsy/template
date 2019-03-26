import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupCodeCodevalueComponent } from './setup-code-codevalue.component';

describe('SetupCodeCodevalueComponent', () => {
  let component: SetupCodeCodevalueComponent;
  let fixture: ComponentFixture<SetupCodeCodevalueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetupCodeCodevalueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetupCodeCodevalueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
