import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DepreciationMethodSelectvaluebindingComponent } from './depreciation-method-selectvaluebinding.component';

describe('DepreciationMethodSelectvaluebindingComponent', () => {
  let component: DepreciationMethodSelectvaluebindingComponent;
  let fixture: ComponentFixture<DepreciationMethodSelectvaluebindingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DepreciationMethodSelectvaluebindingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepreciationMethodSelectvaluebindingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
