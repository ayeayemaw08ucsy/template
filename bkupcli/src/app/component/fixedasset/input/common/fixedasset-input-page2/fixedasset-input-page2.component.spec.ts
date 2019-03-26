import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FixedassetInputPage2Component } from './fixedasset-input-page2.component';

describe('FixedassetInputPage2Component', () => {
  let component: FixedassetInputPage2Component;
  let fixture: ComponentFixture<FixedassetInputPage2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FixedassetInputPage2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FixedassetInputPage2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
