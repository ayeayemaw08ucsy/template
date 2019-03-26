import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupHolidayComponent } from './setup-holiday.component';

describe('SetupHolidayComponent', () => {
  let component: SetupHolidayComponent;
  let fixture: ComponentFixture<SetupHolidayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetupHolidayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetupHolidayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
