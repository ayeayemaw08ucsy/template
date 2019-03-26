import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WeekMaskComponent } from './week-mask.component';

describe('WeekMaskComponent', () => {
  let component: WeekMaskComponent;
  let fixture: ComponentFixture<WeekMaskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WeekMaskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeekMaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
