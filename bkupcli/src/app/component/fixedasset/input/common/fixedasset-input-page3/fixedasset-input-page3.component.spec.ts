import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FixedassetInputPage3Component } from './fixedasset-input-page3.component';

describe('FixedassetInputPage3Component', () => {
  let component: FixedassetInputPage3Component;
  let fixture: ComponentFixture<FixedassetInputPage3Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FixedassetInputPage3Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FixedassetInputPage3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
