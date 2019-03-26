import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FixedassetInputPage4Component } from './fixedasset-input-page4.component';

describe('FixedassetInputPage4Component', () => {
  let component: FixedassetInputPage4Component;
  let fixture: ComponentFixture<FixedassetInputPage4Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FixedassetInputPage4Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FixedassetInputPage4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
