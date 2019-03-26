import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FixedassetInputPage1Component } from './fixedasset-input-page1.component';

describe('FixedassetInputPage1Component', () => {
  let component: FixedassetInputPage1Component;
  let fixture: ComponentFixture<FixedassetInputPage1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FixedassetInputPage1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FixedassetInputPage1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
